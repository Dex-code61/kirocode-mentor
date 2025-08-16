import { createClient, RedisClientType } from 'redis';

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
};

// Redis client configuration with connection pooling and error handling
export const redis = globalForRedis.redis ?? createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 60000,
    // lazyConnect: true,
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Error handling
redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Redis Client Connected');
});

redis.on('ready', () => {
  console.log('Redis Client Ready');
});

redis.on('end', () => {
  console.log('Redis Client Disconnected');
});

// Connect to Redis
if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

export default redis;