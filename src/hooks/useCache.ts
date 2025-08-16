import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '@/services/cache.service';
import { dataCacheService } from '@/services/data-cache.service';

export interface UseCacheOptions {
  key: string;
  ttl?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
  onError?: (error: Error) => void;
}

export interface UseCacheResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => Promise<void>;
  set: (value: T, ttl?: number) => Promise<void>;
}

/**
 * Hook for generic cache operations
 */
export function useCache<T>(
  fetcher: () => Promise<T>,
  options: UseCacheOptions
): UseCacheResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { key, ttl, enabled = true, refetchOnMount = true, onError } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      const cached = await cacheService.get<T>(key);
      
      if (cached) {
        setData(cached);
        setIsLoading(false);
        return;
      }

      // If not in cache, fetch from source
      const freshData = await fetcher();
      setData(freshData);

      // Store in cache
      await cacheService.set(key, freshData, ttl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, ttl, enabled, fetcher, onError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const invalidate = useCallback(async () => {
    try {
      await cacheService.delete(key);
      setData(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to invalidate cache');
      setError(error);
      onError?.(error);
    }
  }, [key, onError]);

  const set = useCallback(async (value: T, customTtl?: number) => {
    try {
      await cacheService.set(key, value, customTtl || ttl);
      setData(value);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to set cache');
      setError(error);
      onError?.(error);
    }
  }, [key, ttl, onError]);

  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    set,
  };
}

/**
 * Hook for user profile caching
 */
export function useUserProfileCache(userId: string) {
  return useCache(
    async () => {
      // This would typically fetch from your API
      const response = await fetch(`/api/users/${userId}/profile`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    },
    {
      key: `user:profile:${userId}`,
      ttl: 60 * 60, // 1 hour
      enabled: !!userId,
    }
  );
}

/**
 * Hook for user progress caching
 */
export function useUserProgressCache(userId: string, exerciseId?: string) {
  return useCache(
    async () => {
      const url = exerciseId 
        ? `/api/users/${userId}/progress/${exerciseId}`
        : `/api/users/${userId}/progress`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return response.json();
    },
    {
      key: exerciseId 
        ? `user:progress:${userId}:${exerciseId}`
        : `user:progress:${userId}`,
      ttl: 30 * 60, // 30 minutes
      enabled: !!userId,
    }
  );
}

/**
 * Hook for learning path caching
 */
export function useLearningPathCache(pathId: string) {
  return useCache(
    async () => {
      const response = await fetch(`/api/learning-paths/${pathId}`);
      if (!response.ok) throw new Error('Failed to fetch learning path');
      return response.json();
    },
    {
      key: `learning:path:${pathId}`,
      ttl: 2 * 60 * 60, // 2 hours
      enabled: !!pathId,
    }
  );
}

/**
 * Hook for exercise caching
 */
export function useExerciseCache(exerciseId: string) {
  return useCache(
    async () => {
      const response = await fetch(`/api/exercises/${exerciseId}`);
      if (!response.ok) throw new Error('Failed to fetch exercise');
      return response.json();
    },
    {
      key: `exercise:${exerciseId}`,
      ttl: 60 * 60, // 1 hour
      enabled: !!exerciseId,
    }
  );
}

/**
 * Hook for code analysis caching
 */
export function useCodeAnalysisCache(codeHash: string) {
  return useCache(
    async () => {
      const response = await fetch('/api/code-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeHash }),
      });
      if (!response.ok) throw new Error('Failed to analyze code');
      return response.json();
    },
    {
      key: `analysis:${codeHash}`,
      ttl: 15 * 60, // 15 minutes
      enabled: !!codeHash,
    }
  );
}

/**
 * Hook for recommendations caching
 */
export function useRecommendationsCache(userId: string) {
  return useCache(
    async () => {
      const response = await fetch(`/api/users/${userId}/recommendations`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
    {
      key: `recommendations:${userId}`,
      ttl: 30 * 60, // 30 minutes
      enabled: !!userId,
    }
  );
}

/**
 * Hook for cache metrics monitoring
 */
export function useCacheMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cache/metrics');
      if (!response.ok) throw new Error('Failed to fetch cache metrics');
      
      const result = await response.json();
      setMetrics(result.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    
    // Set up periodic refresh
    const interval = setInterval(fetchMetrics, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}