import redis from '@/lib/redis';

// Cache key prefixes for different data types
export const CACHE_PREFIXES = {
  USER_SESSION: 'session:',
  USER_PROFILE: 'user:profile:',
  USER_PROGRESS: 'user:progress:',
  LEARNING_PATH: 'learning:path:',
  EXERCISE: 'exercise:',
  CODE_ANALYSIS: 'analysis:',
  RECOMMENDATIONS: 'recommendations:',
  SEARCH_RESULTS: 'search:',
  PERFORMANCE_METRICS: 'metrics:',
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  USER_SESSION: 24 * 60 * 60, // 24 hours
  USER_PROFILE: 60 * 60, // 1 hour
  USER_PROGRESS: 30 * 60, // 30 minutes
  LEARNING_PATH: 2 * 60 * 60, // 2 hours
  EXERCISE: 60 * 60, // 1 hour
  CODE_ANALYSIS: 15 * 60, // 15 minutes
  RECOMMENDATIONS: 30 * 60, // 30 minutes
  SEARCH_RESULTS: 10 * 60, // 10 minutes
  PERFORMANCE_METRICS: 5 * 60, // 5 minutes
} as const;

// Performance monitoring interface
interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  averageResponseTime: number;
}

class CacheService {
  private metricsKey = 'cache:metrics';

  /**
   * Generic cache get method with performance tracking
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      const cached = await redis.get(key);
      const responseTime = Date.now() - startTime;
      
      if (cached) {
        await this.recordCacheHit(responseTime);
        return JSON.parse(cached) as T;
      } else {
        await this.recordCacheMiss(responseTime);
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      await this.recordCacheMiss(Date.now() - startTime);
      return null;
    }
  }

  /**
   * Generic cache set method with TTL
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      
      if (ttl) {
        await redis.setEx(key, ttl, serialized);
      } else {
        await redis.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete a cache key
   */
  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple cache keys by pattern
   */
  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      const result = await redis.del(keys);
      return result;
    } catch (error) {
      console.error('Cache delete by pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Set cache expiration
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, ttl);
      return result === 1;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await redis.mGet(keys);
      return values.map(value => value ? JSON.parse(value) as T : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys at once
   */
  async mset(keyValuePairs: Record<string, any>): Promise<boolean> {
    try {
      const serializedPairs: Record<string, string> = {};
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs[key] = JSON.stringify(value);
      }
      
      await redis.mSet(serializedPairs);
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.incrBy(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Record cache hit for performance monitoring
   */
  private async recordCacheHit(responseTime: number): Promise<void> {
    try {
      const multi = redis.multi();
      multi.hIncrBy(this.metricsKey, 'hits', 1);
      multi.hIncrBy(this.metricsKey, 'totalRequests', 1);
      multi.hIncrBy(this.metricsKey, 'totalResponseTime', responseTime);
      await multi.exec();
    } catch (error) {
      console.error('Error recording cache hit:', error);
    }
  }

  /**
   * Record cache miss for performance monitoring
   */
  private async recordCacheMiss(responseTime: number): Promise<void> {
    try {
      const multi = redis.multi();
      multi.hIncrBy(this.metricsKey, 'misses', 1);
      multi.hIncrBy(this.metricsKey, 'totalRequests', 1);
      multi.hIncrBy(this.metricsKey, 'totalResponseTime', responseTime);
      await multi.exec();
    } catch (error) {
      console.error('Error recording cache miss:', error);
    }
  }

  /**
   * Get cache performance metrics
   */
  async getMetrics(): Promise<CacheMetrics> {
    try {
      const metrics = await redis.hGetAll(this.metricsKey);
      
      const hits = parseInt(metrics.hits || '0');
      const misses = parseInt(metrics.misses || '0');
      const totalRequests = hits + misses;
      const totalResponseTime = parseInt(metrics.totalResponseTime || '0');
      
      return {
        hits,
        misses,
        hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
        totalRequests,
        averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      };
    } catch (error) {
      console.error('Error getting cache metrics:', error);
      return {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalRequests: 0,
        averageResponseTime: 0,
      };
    }
  }

  /**
   * Reset cache metrics
   */
  async resetMetrics(): Promise<boolean> {
    try {
      await redis.del(this.metricsKey);
      return true;
    } catch (error) {
      console.error('Error resetting cache metrics:', error);
      return false;
    }
  }

  /**
   * Get cache info and statistics
   */
  async getInfo(): Promise<any> {
    try {
      const info = await redis.info();
      return info;
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  }

  /**
   * Flush all cache data (use with caution)
   */
  async flushAll(): Promise<boolean> {
    try {
      await redis.flushAll();
      return true;
    } catch (error) {
      console.error('Error flushing cache:', error);
      return false;
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;