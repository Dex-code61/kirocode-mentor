# Redis Caching Layer

This directory contains the comprehensive Redis caching implementation for the KiroCode Mentor platform. The caching layer provides high-performance data storage, session management, and intelligent cache invalidation mechanisms.

## Architecture Overview

The caching system is built with the following components:

- **Core Cache Service** (`cache.service.ts`) - Basic Redis operations with performance monitoring
- **Data Cache Service** (`data-cache.service.ts`) - Specialized caching for application data
- **Session Cache Service** (`session-cache.service.ts`) - User session management
- **Cache Invalidation Service** (`cache-invalidation.service.ts`) - Smart cache invalidation
- **Cache Monitoring Service** (`cache-monitoring.service.ts`) - Performance monitoring and alerting

## Features

### ✅ Core Functionality
- Generic cache operations (get, set, delete, exists)
- Batch operations (mget, mset)
- Pattern-based operations
- TTL (Time To Live) management
- Connection pooling and error handling

### ✅ Performance Monitoring
- Real-time hit/miss rate tracking
- Response time monitoring
- Memory usage tracking
- Connection count monitoring
- Performance alerts and health checks

### ✅ Session Management
- User session caching with automatic expiration
- Activity tracking
- Multi-session support per user
- Session cleanup and statistics

### ✅ Data Caching Strategies
- User profiles with 1-hour TTL
- User progress with 30-minute TTL
- Learning paths with 2-hour TTL
- Exercises with 1-hour TTL
- Code analysis with 15-minute TTL
- Recommendations with 30-minute TTL
- Search results with 10-minute TTL

### ✅ Smart Invalidation
- Event-driven invalidation rules
- Dependency-based invalidation
- Pattern-based bulk invalidation
- Scheduled cleanup tasks
- Invalidation logging and monitoring

## Configuration

### Environment Variables

```bash
# Redis connection
REDIS_URL="redis://localhost:6379"

# Optional Redis configuration
REDIS_PASSWORD="your_password"
REDIS_DB="0"
```

### Cache Prefixes

```typescript
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
```

### TTL Configuration

```typescript
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
```

## Usage Examples

### Basic Cache Operations

```typescript
import { cacheService } from '@/services/cache.service';

// Set data with TTL
await cacheService.set('user:123', userData, 3600);

// Get data
const user = await cacheService.get('user:123');

// Delete data
await cacheService.delete('user:123');

// Check if key exists
const exists = await cacheService.exists('user:123');
```

### User Profile Caching

```typescript
import { dataCacheService } from '@/services/data-cache.service';

// Cache user profile
await dataCacheService.setUserProfile(userId, profileData);

// Retrieve user profile
const profile = await dataCacheService.getUserProfile(userId);

// Invalidate user profile
await dataCacheService.invalidateUserProfile(userId);
```

### Session Management

```typescript
import { sessionCacheService } from '@/services/session-cache.service';

// Store user session
await sessionCacheService.setUserSession(sessionId, sessionData);

// Update session activity
await sessionCacheService.updateSessionActivity(sessionId, {
  lastActivity: new Date(),
});

// Get active sessions for user
const sessions = await sessionCacheService.getUserActiveSessions(userId);
```

### Cache Invalidation

```typescript
import { cacheInvalidationService } from '@/services/cache-invalidation.service';

// Trigger invalidation event
await cacheInvalidationService.invalidate({
  type: 'user.profile.updated',
  entityId: userId,
  userId: userId,
  timestamp: new Date(),
});

// Invalidate by pattern
await cacheInvalidationService.invalidateByPattern('user:*');
```

### Performance Monitoring

```typescript
import { cacheMonitoringService } from '@/services/cache-monitoring.service';

// Get performance metrics
const metrics = await cacheMonitoringService.getPerformanceMetrics();

// Check health status
const health = await cacheMonitoringService.getHealthStatus();

// Generate alerts
const alerts = await cacheMonitoringService.monitorAndAlert();
```

## React Hooks

### useCache Hook

```typescript
import { useCache } from '@/hooks/useCache';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error, refetch } = useCache(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    },
    {
      key: `user:profile:${userId}`,
      ttl: 3600,
      enabled: !!userId,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.name}</div>;
}
```

### Specialized Hooks

```typescript
import { 
  useUserProfileCache,
  useUserProgressCache,
  useLearningPathCache,
  useExerciseCache,
  useCacheMetrics 
} from '@/hooks/useCache';

// User profile caching
const { data: profile } = useUserProfileCache(userId);

// User progress caching
const { data: progress } = useUserProgressCache(userId, exerciseId);

// Learning path caching
const { data: path } = useLearningPathCache(pathId);

// Cache metrics monitoring
const { metrics } = useCacheMetrics();
```

## API Endpoints

### Cache Metrics
- `GET /api/cache/metrics?type=summary` - Get performance metrics
- `GET /api/cache/metrics?type=health` - Get health status
- `GET /api/cache/metrics?type=report` - Get comprehensive report
- `DELETE /api/cache/metrics?action=reset-metrics` - Reset metrics

### Cache Invalidation
- `POST /api/cache/invalidate` - Trigger invalidation event
- `DELETE /api/cache/invalidate?pattern=user:*` - Invalidate by pattern
- `DELETE /api/cache/invalidate?userId=123` - Invalidate user cache
- `DELETE /api/cache/invalidate?key=specific:key` - Invalidate specific key

### Cache Alerts
- `GET /api/cache/alerts?action=recent` - Get recent alerts
- `GET /api/cache/alerts?action=monitor` - Run monitoring and get new alerts

### Cache Cleanup
- `POST /api/cache/cleanup?action=scheduled` - Run scheduled cleanup
- `POST /api/cache/cleanup?action=flush-all` - Flush all cache (dangerous)

## Utilities

### Cache Key Generation

```typescript
import { generateCacheKey, generateCodeHash } from '@/utils/cache.utils';

// Generate consistent cache keys
const key = generateCacheKey('user:profile', userId, 'settings');

// Generate hash for code content
const hash = generateCodeHash(codeContent, 'javascript');
```

### Cache Warming

```typescript
import { cacheWarmer } from '@/utils/cache.utils';

// Warm user cache
await cacheWarmer.warmUserCache(userId);

// Warm popular content
await cacheWarmer.warmPopularContent();
```

### Batch Operations

```typescript
import { cacheBatch } from '@/utils/cache.utils';

// Batch cache operations
const result = await cacheBatch
  .set('key1', data1, 3600)
  .set('key2', data2, 1800)
  .delete('key3')
  .execute();
```

## Performance Optimization

### Connection Pooling
- Automatic connection management
- Reconnection strategy with exponential backoff
- Connection timeout handling

### Memory Management
- Automatic TTL for all cached data
- Scheduled cleanup of expired data
- Memory usage monitoring and alerts

### Query Optimization
- Batch operations for multiple keys
- Pattern-based operations for bulk actions
- Efficient serialization/deserialization

## Monitoring and Alerting

### Performance Metrics
- Hit rate tracking (target: >80%)
- Response time monitoring (target: <100ms)
- Memory usage tracking (alert: >80%)
- Connection count monitoring

### Health Checks
- Automatic health status assessment
- Issue detection and recommendations
- Uptime monitoring

### Alerting System
- Configurable alert thresholds
- Multiple severity levels (low, medium, high, critical)
- Alert history and tracking

## Testing

The caching layer includes comprehensive tests:

```bash
# Run cache service tests
npm run test -- src/services/__tests__/cache.service.test.ts

# Run data cache service tests
npm run test -- src/services/__tests__/data-cache.service.test.ts

# Run all cache tests
npm run test -- src/services/__tests__/cache*.test.ts
```

## Best Practices

### Cache Key Design
- Use consistent prefixes for different data types
- Include version information when needed
- Keep keys short but descriptive
- Use hierarchical structure (e.g., `user:profile:123`)

### TTL Strategy
- Set appropriate TTL based on data volatility
- Use shorter TTL for frequently changing data
- Consider business requirements for data freshness

### Error Handling
- Always handle Redis connection errors gracefully
- Provide fallback mechanisms when cache is unavailable
- Log errors for monitoring and debugging

### Security
- Use Redis AUTH when available
- Encrypt sensitive data before caching
- Implement proper access controls
- Regular security audits

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check TTL settings
   - Review cache key patterns
   - Monitor eviction policies

2. **Low Hit Rate**
   - Analyze cache access patterns
   - Review TTL configuration
   - Check invalidation rules

3. **Connection Issues**
   - Verify Redis server status
   - Check network connectivity
   - Review connection pool settings

4. **Performance Degradation**
   - Monitor Redis server resources
   - Check for memory fragmentation
   - Review query patterns

### Debugging

```typescript
// Enable debug logging
process.env.CACHE_DEBUG = 'true';

// Check cache health
const health = await cacheHealthChecker.performHealthCheck();
console.log('Cache health:', health);

// Get cache statistics
const stats = await cacheStats.getOverview();
console.log('Cache stats:', stats);
```

## Future Enhancements

- [ ] Redis Cluster support for horizontal scaling
- [ ] Advanced cache warming strategies
- [ ] Machine learning-based cache optimization
- [ ] Cross-region cache replication
- [ ] Advanced analytics and reporting
- [ ] Integration with APM tools
- [ ] Cache compression for large objects
- [ ] Distributed cache invalidation

## Contributing

When adding new caching functionality:

1. Follow the established patterns and naming conventions
2. Add appropriate tests for new features
3. Update documentation and examples
4. Consider performance implications
5. Add monitoring and alerting where appropriate
6. Follow security best practices

## Support

For issues related to the caching layer:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Use the health check endpoints
4. Monitor performance metrics
5. Contact the development team for complex issues