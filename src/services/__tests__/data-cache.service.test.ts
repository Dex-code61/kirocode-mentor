import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the cache service first
vi.mock('../cache.service', () => ({
  cacheService: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    deleteByPattern: vi.fn(),
    mget: vi.fn(),
    mset: vi.fn(),
  },
  CACHE_PREFIXES: {
    USER_PROFILE: 'user:profile:',
    USER_PROGRESS: 'user:progress:',
    LEARNING_PATH: 'learning:path:',
    EXERCISE: 'exercise:',
    CODE_ANALYSIS: 'analysis:',
    RECOMMENDATIONS: 'recommendations:',
    SEARCH_RESULTS: 'search:',
  },
  CACHE_TTL: {
    USER_PROFILE: 3600,
    USER_PROGRESS: 1800,
    LEARNING_PATH: 7200,
    EXERCISE: 3600,
    CODE_ANALYSIS: 900,
    RECOMMENDATIONS: 1800,
    SEARCH_RESULTS: 600,
  },
}));

import { dataCacheService } from '../data-cache.service';
import { cacheService } from '../cache.service';

const mockCacheService = cacheService as any;

describe('DataCacheService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Profile Caching', () => {
    const mockProfile = {
      id: 'user123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      currentLevel: 'intermediate',
      skillsMatrix: {},
      achievements: [],
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should set user profile in cache', async () => {
      mockCacheService.set.mockResolvedValue(true);

      const result = await dataCacheService.setUserProfile('user123', mockProfile);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'user:profile:user123',
        mockProfile,
        3600
      );
      expect(result).toBe(true);
    });

    it('should get user profile from cache', async () => {
      mockCacheService.get.mockResolvedValue(mockProfile);

      const result = await dataCacheService.getUserProfile('user123');

      expect(mockCacheService.get).toHaveBeenCalledWith('user:profile:user123');
      expect(result).toEqual(mockProfile);
    });

    it('should invalidate user profile', async () => {
      mockCacheService.delete.mockResolvedValue(true);

      const result = await dataCacheService.invalidateUserProfile('user123');

      expect(mockCacheService.delete).toHaveBeenCalledWith('user:profile:user123');
      expect(result).toBe(true);
    });
  });

  describe('User Progress Caching', () => {
    const mockProgress = {
      userId: 'user123',
      exerciseId: 'exercise456',
      status: 'completed' as const,
      attempts: [],
      timeSpent: 1800,
      lastAccessed: new Date(),
      masteryScore: 85,
    };

    it('should set user progress in cache', async () => {
      mockCacheService.set.mockResolvedValue(true);

      const result = await dataCacheService.setUserProgress(
        'user123',
        'exercise456',
        mockProgress
      );

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'user:progress:user123:exercise456',
        mockProgress,
        1800
      );
      expect(result).toBe(true);
    });

    it('should get user progress from cache', async () => {
      mockCacheService.get.mockResolvedValue(mockProgress);

      const result = await dataCacheService.getUserProgress('user123', 'exercise456');

      expect(mockCacheService.get).toHaveBeenCalledWith('user:progress:user123:exercise456');
      expect(result).toEqual(mockProgress);
    });

    it('should invalidate specific user progress', async () => {
      mockCacheService.delete.mockResolvedValue(true);

      const result = await dataCacheService.invalidateUserProgress('user123', 'exercise456');

      expect(mockCacheService.delete).toHaveBeenCalledWith('user:progress:user123:exercise456');
      expect(result).toBe(1);
    });

    it('should invalidate all user progress', async () => {
      mockCacheService.deleteByPattern.mockResolvedValue(5);

      const result = await dataCacheService.invalidateUserProgress('user123');

      expect(mockCacheService.deleteByPattern).toHaveBeenCalledWith('user:progress:user123:*');
      expect(result).toBe(5);
    });
  });

  describe('Learning Path Caching', () => {
    const mockLearningPath = {
      id: 'path123',
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript basics',
      difficulty: 'beginner',
      estimatedDuration: 3600,
      prerequisites: [],
      steps: [],
      adaptiveRules: [],
    };

    it('should set learning path in cache', async () => {
      mockCacheService.set.mockResolvedValue(true);

      const result = await dataCacheService.setLearningPath('path123', mockLearningPath);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'learning:path:path123',
        mockLearningPath,
        7200
      );
      expect(result).toBe(true);
    });

    it('should get learning path from cache', async () => {
      mockCacheService.get.mockResolvedValue(mockLearningPath);

      const result = await dataCacheService.getLearningPath('path123');

      expect(mockCacheService.get).toHaveBeenCalledWith('learning:path:path123');
      expect(result).toEqual(mockLearningPath);
    });

    it('should set multiple learning paths', async () => {
      const paths = {
        'path123': mockLearningPath,
        'path456': { ...mockLearningPath, id: 'path456' },
      };
      mockCacheService.mset.mockResolvedValue(true);

      const result = await dataCacheService.setMultipleLearningPaths(paths);

      expect(mockCacheService.mset).toHaveBeenCalledWith({
        'learning:path:path123': mockLearningPath,
        'learning:path:path456': { ...mockLearningPath, id: 'path456' },
      });
      expect(result).toBe(true);
    });
  });

  describe('Exercise Caching', () => {
    const mockExercise = {
      id: 'exercise123',
      title: 'Array Methods',
      description: 'Practice array methods',
      type: 'coding' as const,
      difficulty: 3,
      testCases: [],
      hints: [],
    };

    it('should set exercise in cache', async () => {
      mockCacheService.set.mockResolvedValue(true);

      const result = await dataCacheService.setExercise('exercise123', mockExercise);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'exercise:exercise123',
        mockExercise,
        3600
      );
      expect(result).toBe(true);
    });

    it('should get multiple exercises', async () => {
      const exercises = [mockExercise, null, { ...mockExercise, id: 'exercise456' }];
      mockCacheService.mget.mockResolvedValue(exercises);

      const result = await dataCacheService.getMultipleExercises([
        'exercise123',
        'exercise404',
        'exercise456',
      ]);

      expect(mockCacheService.mget).toHaveBeenCalledWith([
        'exercise:exercise123',
        'exercise:exercise404',
        'exercise:exercise456',
      ]);
      expect(result).toEqual(exercises);
    });
  });

  describe('Code Analysis Caching', () => {
    const mockAnalysis = {
      id: 'analysis123',
      code: 'console.log("hello");',
      language: 'javascript',
      errors: [],
      warnings: [],
      suggestions: [],
      complexity: {},
      patterns: [],
      performance: {},
      timestamp: new Date(),
    };

    it('should set code analysis in cache', async () => {
      mockCacheService.set.mockResolvedValue(true);

      const result = await dataCacheService.setCodeAnalysis('hash123', mockAnalysis);

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'analysis:hash123',
        mockAnalysis,
        900
      );
      expect(result).toBe(true);
    });

    it('should get code analysis from cache', async () => {
      mockCacheService.get.mockResolvedValue(mockAnalysis);

      const result = await dataCacheService.getCodeAnalysis('hash123');

      expect(mockCacheService.get).toHaveBeenCalledWith('analysis:hash123');
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('Bulk Operations', () => {
    it('should invalidate all user data', async () => {
      mockCacheService.delete.mockResolvedValue(true);
      mockCacheService.deleteByPattern.mockResolvedValue(3);

      const result = await dataCacheService.invalidateUserData('user123');

      expect(result).toEqual({
        profileInvalidated: true,
        progressInvalidated: 3,
        recommendationsInvalidated: true,
      });
    });
  });
});