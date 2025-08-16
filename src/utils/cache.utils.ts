import crypto from 'crypto';
import { cacheService } from '@/services/cache.service';
import { dataCacheService } from '@/services/data-cache.service';
import { cacheInvalidationService } from '@/services/cache-invalidation.service';

/**
 * Generate a consistent cache key from various inputs
 */
export function generateCacheKey(prefix: string, ...parts: (string | number | object)[]): string {
  const keyParts = parts.map(part => {
    if (typeof part === 'object') {
      return JSON.stringify(part);
    }
    return String(part);
  });
  
  return `${prefix}:${keyParts.join(':')}`;
}

/**
 * Generate a hash for code content to use as cache key
 */
export function generateCodeHash(code: string, language?: string): string {
  const content = language ? `${language}:${code}` : code;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

/**
 * Generate a hash for search queries
 */
export function generateSearchHash(query: string, filters?: object): string {
  const content = filters ? `${query}:${JSON.stringify(filters)}` : query;
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Cache decorator for functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string;
    ttl?: number;
    enabled?: boolean;
  }
): T {
  const { keyGenerator, ttl, enabled = true } = options;

  return (async (...args: Parameters<T>) => {
    if (!enabled) {
      return await fn(...args);
    }

    const cacheKey = keyGenerator(...args);
    
    // Try to get from cache
    const cached = await cacheService.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    await cacheService.set(cacheKey, result, ttl);
    
    return result;
  }) as T;
}

/**
 * Batch cache operations
 */
export class CacheBatch {
  private operations: Array<{
    type: 'set' | 'delete';
    key: string;
    value?: any;
    ttl?: number;
  }> = [];

  set(key: string, value: any, ttl?: number): this {
    this.operations.push({ type: 'set', key, value, ttl });
    return this;
  }

  delete(key: string): this {
    this.operations.push({ type: 'delete', key });
    return this;
  }

  async execute(): Promise<{ success: boolean; results: any[] }> {
    const results: any[] = [];
    let success = true;

    try {
      for (const operation of this.operations) {
        if (operation.type === 'set') {
          const result = await cacheService.set(operation.key, operation.value, operation.ttl);
          results.push({ operation: 'set', key: operation.key, success: result });
          if (!result) success = false;
        } else if (operation.type === 'delete') {
          const result = await cacheService.delete(operation.key);
          results.push({ operation: 'delete', key: operation.key, success: result });
          if (!result) success = false;
        }
      }
    } catch (error) {
      success = false;
      results.push({ error: error instanceof Error ? error.message : 'Unknown error' });
    }

    return { success, results };
  }

  clear(): this {
    this.operations = [];
    return this;
  }
}

/**
 * Cache warming utilities
 */
export class CacheWarmer {
  private warmingTasks: Array<{
    name: string;
    task: () => Promise<void>;
    priority: number;
  }> = [];

  addTask(name: string, task: () => Promise<void>, priority: number = 1): this {
    this.warmingTasks.push({ name, task, priority });
    return this;
  }

  async warmUserCache(userId: string): Promise<void> {
    console.log(`Warming cache for user ${userId}`);
    
    try {
      // Warm user profile
      await this.addTask('user-profile', async () => {
        // This would fetch and cache user profile
        console.log(`Warming user profile cache for ${userId}`);
      });

      // Warm user progress
      await this.addTask('user-progress', async () => {
        // This would fetch and cache user progress
        console.log(`Warming user progress cache for ${userId}`);
      });

      // Warm recommendations
      await this.addTask('recommendations', async () => {
        // This would fetch and cache recommendations
        console.log(`Warming recommendations cache for ${userId}`);
      });

      await this.execute();
    } catch (error) {
      console.error(`Error warming cache for user ${userId}:`, error);
    }
  }

  async warmPopularContent(): Promise<void> {
    console.log('Warming popular content cache');
    
    try {
      // Warm popular learning paths
      await this.addTask('popular-paths', async () => {
        console.log('Warming popular learning paths cache');
      });

      // Warm popular exercises
      await this.addTask('popular-exercises', async () => {
        console.log('Warming popular exercises cache');
      });

      await this.execute();
    } catch (error) {
      console.error('Error warming popular content cache:', error);
    }
  }

  private async execute(): Promise<void> {
    // Sort by priority (higher priority first)
    const sortedTasks = this.warmingTasks.sort((a, b) => b.priority - a.priority);
    
    for (const { name, task } of sortedTasks) {
      try {
        await task();
        console.log(`Cache warming task completed: ${name}`);
      } catch (error) {
        console.error(`Cache warming task failed: ${name}`, error);
      }
    }
    
    this.warmingTasks = [];
  }
}

/**
 * Cache invalidation utilities
 */
export class CacheInvalidator {
  static async invalidateUser(userId: string): Promise<void> {
    await cacheInvalidationService.invalidateUserCache(userId);
  }

  static async invalidateExercise(exerciseId: string): Promise<void> {
    await cacheInvalidationService.invalidate({
      type: 'exercise.updated',
      entityId: exerciseId,
      timestamp: new Date(),
    });
  }

  static async invalidateLearningPath(pathId: string): Promise<void> {
    await cacheInvalidationService.invalidate({
      type: 'learning.path.updated',
      entityId: pathId,
      timestamp: new Date(),
    });
  }

  static async invalidateUserProgress(userId: string, exerciseId?: string): Promise<void> {
    await cacheInvalidationService.invalidate({
      type: 'user.progress.updated',
      entityId: exerciseId || 'all',
      userId,
      timestamp: new Date(),
    });
  }

  static async invalidateCodeAnalysis(): Promise<void> {
    await cacheInvalidationService.invalidate({
      type: 'code.analysis.service.updated',
      entityId: 'all',
      timestamp: new Date(),
    });
  }

  static async invalidateSearch(): Promise<void> {
    await cacheInvalidationService.invalidate({
      type: 'search.index.updated',
      entityId: 'all',
      timestamp: new Date(),
    });
  }
}

/**
 * Cache health check utilities
 */
export class CacheHealthChecker {
  static async performHealthCheck(): Promise<{
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      // Test basic connectivity
      await cacheService.set('health-check', { timestamp: Date.now() }, 60);
      const retrieved = await cacheService.get('health-check');
      
      if (!retrieved) {
        return {
          isHealthy: false,
          issues: ['Cache connectivity test failed'],
          recommendations: ['Check Redis server status and connection'],
        };
      }

      // Clean up test key
      await cacheService.delete('health-check');

      // Get detailed health status
      const healthStatus = await import('@/services/cache-monitoring.service')
        .then(module => module.cacheMonitoringService.getHealthStatus());

      return {
        isHealthy: healthStatus.status === 'healthy',
        issues: healthStatus.issues,
        recommendations: healthStatus.recommendations,
      };
    } catch (error) {
      return {
        isHealthy: false,
        issues: [`Health check failed: ${error}`],
        recommendations: ['Check Redis server connectivity and configuration'],
      };
    }
  }
}

/**
 * Cache statistics utilities
 */
export class CacheStats {
  static async getOverview(): Promise<{
    performance: any;
    distribution: any;
    health: any;
  }> {
    const [performance, distribution, health] = await Promise.all([
      import('@/services/cache-monitoring.service')
        .then(module => module.cacheMonitoringService.getPerformanceMetrics()),
      dataCacheService.getCacheStats(),
      import('@/services/cache-monitoring.service')
        .then(module => module.cacheMonitoringService.getHealthStatus()),
    ]);

    return {
      performance,
      distribution,
      health,
    };
  }
}

// Export utility instances
export const cacheBatch = new CacheBatch();
export const cacheWarmer = new CacheWarmer();
export const cacheInvalidator = CacheInvalidator;
export const cacheHealthChecker = CacheHealthChecker;
export const cacheStats = CacheStats;