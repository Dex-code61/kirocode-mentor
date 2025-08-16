import { cacheService } from './cache.service';
import { dataCacheService } from './data-cache.service';
import { sessionCacheService } from './session-cache.service';

export interface InvalidationRule {
  trigger: string;
  patterns: string[];
  dependencies?: string[];
}

export interface InvalidationEvent {
  type: string;
  entityId: string;
  userId?: string;
  metadata?: any;
  timestamp: Date;
}

class CacheInvalidationService {
  private invalidationRules: Map<string, InvalidationRule[]> = new Map();

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Setup default invalidation rules
   */
  private setupDefaultRules(): void {
    // User profile update invalidation
    this.addRule('user.profile.updated', {
      trigger: 'user.profile.updated',
      patterns: ['user:profile:{userId}', 'recommendations:{userId}'],
      dependencies: ['user.sessions'],
    });

    // User progress update invalidation
    this.addRule('user.progress.updated', {
      trigger: 'user.progress.updated',
      patterns: ['user:progress:{userId}:*', 'recommendations:{userId}'],
    });

    // Exercise update invalidation
    this.addRule('exercise.updated', {
      trigger: 'exercise.updated',
      patterns: ['exercise:{exerciseId}', 'user:progress:*:{exerciseId}'],
      dependencies: ['learning.paths'],
    });

    // Learning path update invalidation
    this.addRule('learning.path.updated', {
      trigger: 'learning.path.updated',
      patterns: ['learning:path:{pathId}', 'recommendations:*'],
    });

    // Code analysis invalidation (when analysis service is updated)
    this.addRule('code.analysis.service.updated', {
      trigger: 'code.analysis.service.updated',
      patterns: ['analysis:*'],
    });

    // Search index update invalidation
    this.addRule('search.index.updated', {
      trigger: 'search.index.updated',
      patterns: ['search:*'],
    });

    // User logout invalidation
    this.addRule('user.logout', {
      trigger: 'user.logout',
      patterns: ['session:*', 'recommendations:{userId}'],
    });

    // System maintenance invalidation
    this.addRule('system.maintenance', {
      trigger: 'system.maintenance',
      patterns: ['*'], // Invalidate everything
    });
  }

  /**
   * Add a new invalidation rule
   */
  addRule(trigger: string, rule: InvalidationRule): void {
    if (!this.invalidationRules.has(trigger)) {
      this.invalidationRules.set(trigger, []);
    }
    this.invalidationRules.get(trigger)!.push(rule);
  }

  /**
   * Remove an invalidation rule
   */
  removeRule(trigger: string, ruleIndex?: number): void {
    if (!this.invalidationRules.has(trigger)) return;

    if (ruleIndex !== undefined) {
      const rules = this.invalidationRules.get(trigger)!;
      rules.splice(ruleIndex, 1);
      if (rules.length === 0) {
        this.invalidationRules.delete(trigger);
      }
    } else {
      this.invalidationRules.delete(trigger);
    }
  }

  /**
   * Trigger cache invalidation based on an event
   */
  async invalidate(event: InvalidationEvent): Promise<{
    success: boolean;
    invalidatedKeys: string[];
    errors: string[];
  }> {
    const result = {
      success: true,
      invalidatedKeys: [] as string[],
      errors: [] as string[],
    };

    try {
      const rules = this.invalidationRules.get(event.type) || [];
      
      for (const rule of rules) {
        try {
          const keysToInvalidate = await this.resolvePatterns(rule.patterns, event);
          
          for (const key of keysToInvalidate) {
            const deleted = await cacheService.delete(key);
            if (deleted) {
              result.invalidatedKeys.push(key);
            }
          }

          // Handle dependencies
          if (rule.dependencies) {
            for (const dependency of rule.dependencies) {
              const dependencyEvent: InvalidationEvent = {
                ...event,
                type: dependency,
              };
              const dependencyResult = await this.invalidate(dependencyEvent);
              result.invalidatedKeys.push(...dependencyResult.invalidatedKeys);
              result.errors.push(...dependencyResult.errors);
            }
          }
        } catch (error) {
          result.errors.push(`Error processing rule ${rule.trigger}: ${error}`);
          result.success = false;
        }
      }

      // Log invalidation event
      await this.logInvalidationEvent(event, result);

    } catch (error) {
      result.errors.push(`Error during invalidation: ${error}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Resolve patterns with actual values from the event
   */
  private async resolvePatterns(patterns: string[], event: InvalidationEvent): Promise<string[]> {
    const resolvedKeys: string[] = [];

    for (const pattern of patterns) {
      let resolvedPattern = pattern
        .replace('{userId}', event.userId || '')
        .replace('{entityId}', event.entityId)
        .replace('{exerciseId}', event.entityId)
        .replace('{pathId}', event.entityId);

      if (resolvedPattern.includes('*')) {
        // Handle wildcard patterns
        try {
          const keys = await this.getKeysByPattern(resolvedPattern);
          resolvedKeys.push(...keys);
        } catch (error) {
          console.error('Error resolving wildcard pattern:', error);
        }
      } else {
        resolvedKeys.push(resolvedPattern);
      }
    }

    return resolvedKeys;
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidateByPattern(pattern: string): Promise<number> {
    return await cacheService.deleteByPattern(pattern);
  }

  /**
   * Invalidate all user-related cache
   */
  async invalidateUserCache(userId: string): Promise<{
    profileInvalidated: boolean;
    progressInvalidated: number;
    sessionsInvalidated: number;
    recommendationsInvalidated: boolean;
  }> {
    const [
      { profileInvalidated, progressInvalidated, recommendationsInvalidated },
      sessionsInvalidated,
    ] = await Promise.all([
      dataCacheService.invalidateUserData(userId),
      sessionCacheService.invalidateUserSessions(userId),
    ]);

    return {
      profileInvalidated,
      progressInvalidated,
      sessionsInvalidated,
      recommendationsInvalidated,
    };
  }

  /**
   * Scheduled cache cleanup
   */
  async scheduledCleanup(): Promise<{
    expiredSessionsCleanup: number;
    staleDataCleanup: number;
    totalKeysRemoved: number;
  }> {
    try {
      const [expiredSessionsCleanup, staleDataCleanup] = await Promise.all([
        sessionCacheService.cleanupExpiredSessions(),
        this.cleanupStaleData(),
      ]);

      const totalKeysRemoved = expiredSessionsCleanup + staleDataCleanup;

      console.log(`Cache cleanup completed: ${totalKeysRemoved} keys removed`);

      return {
        expiredSessionsCleanup,
        staleDataCleanup,
        totalKeysRemoved,
      };
    } catch (error) {
      console.error('Error during scheduled cleanup:', error);
      return {
        expiredSessionsCleanup: 0,
        staleDataCleanup: 0,
        totalKeysRemoved: 0,
      };
    }
  }

  /**
   * Clean up stale data (data older than certain thresholds)
   */
  private async cleanupStaleData(): Promise<number> {
    let cleanedCount = 0;

    try {
      // Clean up old code analysis results (older than 1 hour)
      const analysisPattern = 'analysis:*';
      const analysisKeys = await this.getKeysByPattern(analysisPattern);
      
      for (const key of analysisKeys) {
        const analysis = await cacheService.get(key);
        if (analysis && analysis.timestamp) {
          const age = Date.now() - new Date(analysis.timestamp).getTime();
          const oneHour = 60 * 60 * 1000;
          
          if (age > oneHour) {
            const deleted = await cacheService.delete(key);
            if (deleted) cleanedCount++;
          }
        }
      }

      // Clean up old search results (older than 30 minutes)
      const searchPattern = 'search:*';
      const searchKeys = await this.getKeysByPattern(searchPattern);
      
      for (const key of searchKeys) {
        // Check TTL and remove if expired
        const ttl = await this.getKeyTTL(key);
        if (ttl === -1) { // Key exists but has no TTL
          const deleted = await cacheService.delete(key);
          if (deleted) cleanedCount++;
        }
      }

    } catch (error) {
      console.error('Error cleaning up stale data:', error);
    }

    return cleanedCount;
  }

  /**
   * Log invalidation events for monitoring
   */
  private async logInvalidationEvent(
    event: InvalidationEvent,
    result: { invalidatedKeys: string[]; errors: string[] }
  ): Promise<void> {
    try {
      const logEntry = {
        event,
        result,
        timestamp: new Date(),
      };

      // Store in cache for monitoring (with 24h TTL)
      const logKey = `invalidation:log:${Date.now()}`;
      await cacheService.set(logKey, logEntry, 24 * 60 * 60);

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Cache invalidation:', logEntry);
      }
    } catch (error) {
      console.error('Error logging invalidation event:', error);
    }
  }

  /**
   * Get invalidation logs for monitoring
   */
  async getInvalidationLogs(limit: number = 50): Promise<any[]> {
    try {
      const pattern = 'invalidation:log:*';
      const keys = await this.getKeysByPattern(pattern);
      
      // Sort by timestamp (descending)
      const sortedKeys = keys
        .sort((a, b) => {
          const timestampA = parseInt(a.split(':')[2]);
          const timestampB = parseInt(b.split(':')[2]);
          return timestampB - timestampA;
        })
        .slice(0, limit);

      const logs = await cacheService.mget(sortedKeys);
      return logs.filter(log => log !== null);
    } catch (error) {
      console.error('Error getting invalidation logs:', error);
      return [];
    }
  }

  /**
   * Helper methods
   */
  private async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      return await (redis as any).keys(pattern);
    } catch (error) {
      console.error('Error getting keys by pattern:', error);
      return [];
    }
  }

  private async getKeyTTL(key: string): Promise<number> {
    try {
      return await (redis as any).ttl(key);
    } catch (error) {
      console.error('Error getting key TTL:', error);
      return -1;
    }
  }
}

export const cacheInvalidationService = new CacheInvalidationService();
export default cacheInvalidationService;