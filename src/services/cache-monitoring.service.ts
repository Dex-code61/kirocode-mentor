import { cacheService } from './cache.service';
import { dataCacheService } from './data-cache.service';
import { sessionCacheService } from './session-cache.service';

export interface CachePerformanceMetrics {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  averageResponseTime: number;
  memoryUsage: number;
  keyCount: number;
  evictionCount: number;
  connectionCount: number;
}

export interface CacheHealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  uptime: number;
  lastCheck: Date;
}

export interface CacheAlert {
  id: string;
  type: 'performance' | 'memory' | 'connection' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: any;
}

class CacheMonitoringService {
  private alertThresholds = {
    hitRate: {
      warning: 80, // Below 80% hit rate
      critical: 60, // Below 60% hit rate
    },
    responseTime: {
      warning: 100, // Above 100ms average
      critical: 500, // Above 500ms average
    },
    memoryUsage: {
      warning: 80, // Above 80% memory usage
      critical: 95, // Above 95% memory usage
    },
    connectionCount: {
      warning: 80, // Above 80% of max connections
      critical: 95, // Above 95% of max connections
    },
  };

  /**
   * Get comprehensive cache performance metrics
   */
  async getPerformanceMetrics(): Promise<CachePerformanceMetrics> {
    try {
      const [basicMetrics, redisInfo, cacheStats] = await Promise.all([
        cacheService.getMetrics(),
        this.getRedisInfo(),
        dataCacheService.getCacheStats(),
      ]);

      const totalKeys = Object.values(cacheStats).reduce((sum, count) => sum + count, 0);

      return {
        hitRate: basicMetrics.hitRate,
        missRate: 100 - basicMetrics.hitRate,
        totalRequests: basicMetrics.totalRequests,
        averageResponseTime: basicMetrics.averageResponseTime,
        memoryUsage: this.parseMemoryUsage(redisInfo),
        keyCount: totalKeys,
        evictionCount: this.parseEvictionCount(redisInfo),
        connectionCount: this.parseConnectionCount(redisInfo),
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return {
        hitRate: 0,
        missRate: 100,
        totalRequests: 0,
        averageResponseTime: 0,
        memoryUsage: 0,
        keyCount: 0,
        evictionCount: 0,
        connectionCount: 0,
      };
    }
  }

  /**
   * Check cache health status
   */
  async getHealthStatus(): Promise<CacheHealthStatus> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    try {
      const metrics = await this.getPerformanceMetrics();
      const redisInfo = await this.getRedisInfo();

      // Check hit rate
      if (metrics.hitRate < this.alertThresholds.hitRate.critical) {
        status = 'critical';
        issues.push(`Critical: Cache hit rate is ${metrics.hitRate.toFixed(1)}% (below ${this.alertThresholds.hitRate.critical}%)`);
        recommendations.push('Review caching strategies and TTL values');
      } else if (metrics.hitRate < this.alertThresholds.hitRate.warning) {
        if (status !== 'critical') status = 'warning';
        issues.push(`Warning: Cache hit rate is ${metrics.hitRate.toFixed(1)}% (below ${this.alertThresholds.hitRate.warning}%)`);
        recommendations.push('Consider optimizing cache keys and warming strategies');
      }

      // Check response time
      if (metrics.averageResponseTime > this.alertThresholds.responseTime.critical) {
        status = 'critical';
        issues.push(`Critical: Average response time is ${metrics.averageResponseTime.toFixed(1)}ms`);
        recommendations.push('Check Redis server performance and network latency');
      } else if (metrics.averageResponseTime > this.alertThresholds.responseTime.warning) {
        if (status !== 'critical') status = 'warning';
        issues.push(`Warning: Average response time is ${metrics.averageResponseTime.toFixed(1)}ms`);
        recommendations.push('Monitor Redis server load and consider connection pooling');
      }

      // Check memory usage
      if (metrics.memoryUsage > this.alertThresholds.memoryUsage.critical) {
        status = 'critical';
        issues.push(`Critical: Memory usage is ${metrics.memoryUsage.toFixed(1)}%`);
        recommendations.push('Implement cache eviction policies and reduce TTL values');
      } else if (metrics.memoryUsage > this.alertThresholds.memoryUsage.warning) {
        if (status !== 'critical') status = 'warning';
        issues.push(`Warning: Memory usage is ${metrics.memoryUsage.toFixed(1)}%`);
        recommendations.push('Monitor memory usage and consider cache cleanup');
      }

      // Check connection count
      if (metrics.connectionCount > this.alertThresholds.connectionCount.critical) {
        status = 'critical';
        issues.push(`Critical: Connection count is high (${metrics.connectionCount})`);
        recommendations.push('Implement connection pooling and review connection management');
      } else if (metrics.connectionCount > this.alertThresholds.connectionCount.warning) {
        if (status !== 'critical') status = 'warning';
        issues.push(`Warning: Connection count is elevated (${metrics.connectionCount})`);
        recommendations.push('Monitor connection usage patterns');
      }

      // Check for high eviction rate
      if (metrics.evictionCount > 1000) {
        if (status !== 'critical') status = status === 'healthy' ? 'warning' : status;
        issues.push(`High eviction count: ${metrics.evictionCount} keys evicted`);
        recommendations.push('Increase memory limit or optimize cache usage patterns');
      }

      return {
        status,
        issues,
        recommendations,
        uptime: this.parseUptime(redisInfo),
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        status: 'critical',
        issues: [`Error checking cache health: ${error}`],
        recommendations: ['Check Redis server connectivity and configuration'],
        uptime: 0,
        lastCheck: new Date(),
      };
    }
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(): Promise<{
    summary: CachePerformanceMetrics;
    health: CacheHealthStatus;
    sessionStats: any;
    cacheDistribution: any;
    trends: any;
  }> {
    const [summary, health, sessionStats, cacheDistribution] = await Promise.all([
      this.getPerformanceMetrics(),
      this.getHealthStatus(),
      sessionCacheService.getSessionStats(),
      dataCacheService.getCacheStats(),
    ]);

    // Get trends (simplified - in production you'd store historical data)
    const trends = await this.getTrends();

    return {
      summary,
      health,
      sessionStats,
      cacheDistribution,
      trends,
    };
  }

  /**
   * Monitor cache performance and generate alerts
   */
  async monitorAndAlert(): Promise<CacheAlert[]> {
    const alerts: CacheAlert[] = [];
    
    try {
      const metrics = await this.getPerformanceMetrics();
      const health = await this.getHealthStatus();

      // Generate alerts based on thresholds
      if (metrics.hitRate < this.alertThresholds.hitRate.critical) {
        alerts.push({
          id: `hit-rate-${Date.now()}`,
          type: 'performance',
          severity: 'critical',
          message: `Cache hit rate critically low: ${metrics.hitRate.toFixed(1)}%`,
          timestamp: new Date(),
          resolved: false,
          metadata: { hitRate: metrics.hitRate, threshold: this.alertThresholds.hitRate.critical },
        });
      }

      if (metrics.averageResponseTime > this.alertThresholds.responseTime.critical) {
        alerts.push({
          id: `response-time-${Date.now()}`,
          type: 'performance',
          severity: 'critical',
          message: `Cache response time critically high: ${metrics.averageResponseTime.toFixed(1)}ms`,
          timestamp: new Date(),
          resolved: false,
          metadata: { responseTime: metrics.averageResponseTime, threshold: this.alertThresholds.responseTime.critical },
        });
      }

      if (metrics.memoryUsage > this.alertThresholds.memoryUsage.critical) {
        alerts.push({
          id: `memory-${Date.now()}`,
          type: 'memory',
          severity: 'critical',
          message: `Cache memory usage critically high: ${metrics.memoryUsage.toFixed(1)}%`,
          timestamp: new Date(),
          resolved: false,
          metadata: { memoryUsage: metrics.memoryUsage, threshold: this.alertThresholds.memoryUsage.critical },
        });
      }

      // Store alerts for tracking
      for (const alert of alerts) {
        await this.storeAlert(alert);
      }

    } catch (error) {
      alerts.push({
        id: `monitoring-error-${Date.now()}`,
        type: 'error',
        severity: 'high',
        message: `Error during cache monitoring: ${error}`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    return alerts;
  }

  /**
   * Get cache usage trends (simplified implementation)
   */
  private async getTrends(): Promise<any> {
    try {
      // In a production system, you would store historical metrics
      // and calculate trends over time. This is a simplified version.
      const currentMetrics = await this.getPerformanceMetrics();
      
      return {
        hitRateTrend: 'stable', // Would calculate from historical data
        responseTimeTrend: 'improving',
        memoryUsageTrend: 'increasing',
        requestVolumeTrend: 'stable',
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error getting trends:', error);
      return {
        hitRateTrend: 'unknown',
        responseTimeTrend: 'unknown',
        memoryUsageTrend: 'unknown',
        requestVolumeTrend: 'unknown',
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Store alert for tracking
   */
  private async storeAlert(alert: CacheAlert): Promise<void> {
    try {
      const alertKey = `alert:${alert.id}`;
      await cacheService.set(alertKey, alert, 24 * 60 * 60); // 24 hours TTL
    } catch (error) {
      console.error('Error storing alert:', error);
    }
  }

  /**
   * Get recent alerts
   */
  async getRecentAlerts(limit: number = 20): Promise<CacheAlert[]> {
    try {
      const pattern = 'alert:*';
      const keys = await this.getKeysByPattern(pattern);
      
      const sortedKeys = keys
        .sort((a, b) => {
          const timestampA = a.split('-').pop() || '0';
          const timestampB = b.split('-').pop() || '0';
          return parseInt(timestampB) - parseInt(timestampA);
        })
        .slice(0, limit);

      const alerts = await cacheService.mget<CacheAlert>(sortedKeys);
      return alerts.filter((alert): alert is CacheAlert => alert !== null);
    } catch (error) {
      console.error('Error getting recent alerts:', error);
      return [];
    }
  }

  /**
   * Helper methods to parse Redis info
   */
  private async getRedisInfo(): Promise<string> {
    try {
      return await cacheService.getInfo() || '';
    } catch (error) {
      console.error('Error getting Redis info:', error);
      return '';
    }
  }

  private parseMemoryUsage(info: string): number {
    try {
      const usedMemoryMatch = info.match(/used_memory:(\d+)/);
      const maxMemoryMatch = info.match(/maxmemory:(\d+)/);
      
      if (usedMemoryMatch && maxMemoryMatch) {
        const used = parseInt(usedMemoryMatch[1]);
        const max = parseInt(maxMemoryMatch[1]);
        return max > 0 ? (used / max) * 100 : 0;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  private parseEvictionCount(info: string): number {
    try {
      const match = info.match(/evicted_keys:(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  private parseConnectionCount(info: string): number {
    try {
      const match = info.match(/connected_clients:(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  private parseUptime(info: string): number {
    try {
      const match = info.match(/uptime_in_seconds:(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      return await (redis as any).keys(pattern);
    } catch (error) {
      console.error('Error getting keys by pattern:', error);
      return [];
    }
  }
}

export const cacheMonitoringService = new CacheMonitoringService();
export default cacheMonitoringService;