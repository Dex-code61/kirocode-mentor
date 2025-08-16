import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the redis import first
vi.mock('@/lib/redis', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    setEx: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    exists: vi.fn(),
    expire: vi.fn(),
    mGet: vi.fn(),
    mSet: vi.fn(),
    incrBy: vi.fn(),
    multi: vi.fn(() => ({
      hIncrBy: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })),
    hGetAll: vi.fn(),
    info: vi.fn(),
    flushAll: vi.fn(),
  },
}));

import { cacheService } from '../cache.service';
import redis from '@/lib/redis';

const mockRedis = redis as any;

describe('CacheService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('get', () => {
    it('should return parsed data when key exists', async () => {
      const testData = { id: 1, name: 'test' };
      mockRedis.get.mockResolvedValue(JSON.stringify(testData));

      const result = await cacheService.get('test-key');

      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null when key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.get('non-existent-key');

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data without TTL', async () => {
      const testData = { id: 1, name: 'test' };
      mockRedis.set.mockResolvedValue('OK');

      const result = await cacheService.set('test-key', testData);

      expect(mockRedis.set).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
      expect(result).toBe(true);
    });

    it('should set data with TTL', async () => {
      const testData = { id: 1, name: 'test' };
      const ttl = 3600;
      mockRedis.setEx.mockResolvedValue('OK');

      const result = await cacheService.set('test-key', testData, ttl);

      expect(mockRedis.setEx).toHaveBeenCalledWith('test-key', ttl, JSON.stringify(testData));
      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      mockRedis.set.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.set('error-key', { test: 'data' });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete existing key', async () => {
      mockRedis.del.mockResolvedValue(1);

      const result = await cacheService.delete('test-key');

      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      mockRedis.del.mockResolvedValue(0);

      const result = await cacheService.delete('non-existent-key');

      expect(result).toBe(false);
    });
  });

  describe('deleteByPattern', () => {
    it('should delete multiple keys matching pattern', async () => {
      const keys = ['user:1', 'user:2', 'user:3'];
      mockRedis.keys.mockResolvedValue(keys);
      mockRedis.del.mockResolvedValue(3);

      const result = await cacheService.deleteByPattern('user:*');

      expect(mockRedis.keys).toHaveBeenCalledWith('user:*');
      expect(mockRedis.del).toHaveBeenCalledWith(keys);
      expect(result).toBe(3);
    });

    it('should return 0 when no keys match pattern', async () => {
      mockRedis.keys.mockResolvedValue([]);

      const result = await cacheService.deleteByPattern('nonexistent:*');

      expect(result).toBe(0);
    });
  });

  describe('exists', () => {
    it('should return true when key exists', async () => {
      mockRedis.exists.mockResolvedValue(1);

      const result = await cacheService.exists('test-key');

      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      mockRedis.exists.mockResolvedValue(0);

      const result = await cacheService.exists('non-existent-key');

      expect(result).toBe(false);
    });
  });

  describe('mget', () => {
    it('should return multiple values', async () => {
      const values = [JSON.stringify({ id: 1 }), JSON.stringify({ id: 2 }), null];
      mockRedis.mGet.mockResolvedValue(values);

      const result = await cacheService.mget(['key1', 'key2', 'key3']);

      expect(result).toEqual([{ id: 1 }, { id: 2 }, null]);
    });
  });

  describe('mset', () => {
    it('should set multiple key-value pairs', async () => {
      const data = {
        'key1': { id: 1 },
        'key2': { id: 2 },
      };
      mockRedis.mSet.mockResolvedValue('OK');

      const result = await cacheService.mset(data);

      expect(mockRedis.mSet).toHaveBeenCalledWith({
        'key1': JSON.stringify({ id: 1 }),
        'key2': JSON.stringify({ id: 2 }),
      });
      expect(result).toBe(true);
    });
  });

  describe('increment', () => {
    it('should increment a numeric value', async () => {
      mockRedis.incrBy.mockResolvedValue(5);

      const result = await cacheService.increment('counter', 2);

      expect(mockRedis.incrBy).toHaveBeenCalledWith('counter', 2);
      expect(result).toBe(5);
    });
  });

  describe('getMetrics', () => {
    it('should return cache metrics', async () => {
      mockRedis.hGetAll.mockResolvedValue({
        hits: '100',
        misses: '20',
        totalResponseTime: '1000',
      });

      const result = await cacheService.getMetrics();

      expect(result).toEqual({
        hits: 100,
        misses: 20,
        hitRate: (100 / 120) * 100,
        totalRequests: 120,
        averageResponseTime: 1000 / 120,
      });
    });

    it('should handle empty metrics', async () => {
      mockRedis.hGetAll.mockResolvedValue({});

      const result = await cacheService.getMetrics();

      expect(result).toEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalRequests: 0,
        averageResponseTime: 0,
      });
    });
  });

  describe('resetMetrics', () => {
    it('should reset cache metrics', async () => {
      mockRedis.del.mockResolvedValue(1);

      const result = await cacheService.resetMetrics();

      expect(mockRedis.del).toHaveBeenCalledWith('cache:metrics');
      expect(result).toBe(true);
    });
  });

  describe('flushAll', () => {
    it('should flush all cache data', async () => {
      mockRedis.flushAll.mockResolvedValue('OK');

      const result = await cacheService.flushAll();

      expect(mockRedis.flushAll).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});