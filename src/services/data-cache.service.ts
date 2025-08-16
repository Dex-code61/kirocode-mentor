import { cacheService, CACHE_PREFIXES, CACHE_TTL } from './cache.service';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  currentLevel: string;
  skillsMatrix: any;
  achievements: any[];
  preferences: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  exerciseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  attempts: any[];
  timeSpent: number;
  lastAccessed: Date;
  masteryScore: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: number;
  prerequisites: string[];
  steps: any[];
  adaptiveRules: any[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'quiz' | 'project' | 'debugging';
  difficulty: number;
  expectedSolution?: string;
  testCases: any[];
  hints: any[];
}

export interface CodeAnalysisResult {
  id: string;
  code: string;
  language: string;
  errors: any[];
  warnings: any[];
  suggestions: any[];
  complexity: any;
  patterns: any[];
  performance: any;
  timestamp: Date;
}

class DataCacheService {
  /**
   * User Profile Caching
   */
  async setUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`;
    return await cacheService.set(key, profile, CACHE_TTL.USER_PROFILE);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`;
    return await cacheService.get<UserProfile>(key);
  }

  async invalidateUserProfile(userId: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_PROFILE}${userId}`;
    return await cacheService.delete(key);
  }

  /**
   * User Progress Caching
   */
  async setUserProgress(userId: string, exerciseId: string, progress: UserProgress): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_PROGRESS}${userId}:${exerciseId}`;
    return await cacheService.set(key, progress, CACHE_TTL.USER_PROGRESS);
  }

  async getUserProgress(userId: string, exerciseId: string): Promise<UserProgress | null> {
    const key = `${CACHE_PREFIXES.USER_PROGRESS}${userId}:${exerciseId}`;
    return await cacheService.get<UserProgress>(key);
  }

  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const pattern = `${CACHE_PREFIXES.USER_PROGRESS}${userId}:*`;
      const keys = await this.getKeysByPattern(pattern);
      
      if (keys.length === 0) return [];

      const progressList = await cacheService.mget<UserProgress>(keys);
      return progressList.filter((progress): progress is UserProgress => progress !== null);
    } catch (error) {
      console.error('Error getting all user progress:', error);
      return [];
    }
  }

  async invalidateUserProgress(userId: string, exerciseId?: string): Promise<number> {
    if (exerciseId) {
      const key = `${CACHE_PREFIXES.USER_PROGRESS}${userId}:${exerciseId}`;
      const deleted = await cacheService.delete(key);
      return deleted ? 1 : 0;
    } else {
      const pattern = `${CACHE_PREFIXES.USER_PROGRESS}${userId}:*`;
      return await cacheService.deleteByPattern(pattern);
    }
  }

  /**
   * Learning Path Caching
   */
  async setLearningPath(pathId: string, path: LearningPath): Promise<boolean> {
    const key = `${CACHE_PREFIXES.LEARNING_PATH}${pathId}`;
    return await cacheService.set(key, path, CACHE_TTL.LEARNING_PATH);
  }

  async getLearningPath(pathId: string): Promise<LearningPath | null> {
    const key = `${CACHE_PREFIXES.LEARNING_PATH}${pathId}`;
    return await cacheService.get<LearningPath>(key);
  }

  async setMultipleLearningPaths(paths: Record<string, LearningPath>): Promise<boolean> {
    const keyValuePairs: Record<string, LearningPath> = {};
    
    for (const [pathId, path] of Object.entries(paths)) {
      const key = `${CACHE_PREFIXES.LEARNING_PATH}${pathId}`;
      keyValuePairs[key] = path;
    }

    return await cacheService.mset(keyValuePairs);
  }

  async invalidateLearningPath(pathId: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.LEARNING_PATH}${pathId}`;
    return await cacheService.delete(key);
  }

  /**
   * Exercise Caching
   */
  async setExercise(exerciseId: string, exercise: Exercise): Promise<boolean> {
    const key = `${CACHE_PREFIXES.EXERCISE}${exerciseId}`;
    return await cacheService.set(key, exercise, CACHE_TTL.EXERCISE);
  }

  async getExercise(exerciseId: string): Promise<Exercise | null> {
    const key = `${CACHE_PREFIXES.EXERCISE}${exerciseId}`;
    return await cacheService.get<Exercise>(key);
  }

  async getMultipleExercises(exerciseIds: string[]): Promise<(Exercise | null)[]> {
    const keys = exerciseIds.map(id => `${CACHE_PREFIXES.EXERCISE}${id}`);
    return await cacheService.mget<Exercise>(keys);
  }

  async invalidateExercise(exerciseId: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.EXERCISE}${exerciseId}`;
    return await cacheService.delete(key);
  }

  /**
   * Code Analysis Caching
   */
  async setCodeAnalysis(codeHash: string, analysis: CodeAnalysisResult): Promise<boolean> {
    const key = `${CACHE_PREFIXES.CODE_ANALYSIS}${codeHash}`;
    return await cacheService.set(key, analysis, CACHE_TTL.CODE_ANALYSIS);
  }

  async getCodeAnalysis(codeHash: string): Promise<CodeAnalysisResult | null> {
    const key = `${CACHE_PREFIXES.CODE_ANALYSIS}${codeHash}`;
    return await cacheService.get<CodeAnalysisResult>(key);
  }

  async invalidateCodeAnalysis(codeHash: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.CODE_ANALYSIS}${codeHash}`;
    return await cacheService.delete(key);
  }

  /**
   * Recommendations Caching
   */
  async setRecommendations(userId: string, recommendations: any[]): Promise<boolean> {
    const key = `${CACHE_PREFIXES.RECOMMENDATIONS}${userId}`;
    return await cacheService.set(key, recommendations, CACHE_TTL.RECOMMENDATIONS);
  }

  async getRecommendations(userId: string): Promise<any[] | null> {
    const key = `${CACHE_PREFIXES.RECOMMENDATIONS}${userId}`;
    return await cacheService.get<any[]>(key);
  }

  async invalidateRecommendations(userId: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.RECOMMENDATIONS}${userId}`;
    return await cacheService.delete(key);
  }

  /**
   * Search Results Caching
   */
  async setSearchResults(queryHash: string, results: any[]): Promise<boolean> {
    const key = `${CACHE_PREFIXES.SEARCH_RESULTS}${queryHash}`;
    return await cacheService.set(key, results, CACHE_TTL.SEARCH_RESULTS);
  }

  async getSearchResults(queryHash: string): Promise<any[] | null> {
    const key = `${CACHE_PREFIXES.SEARCH_RESULTS}${queryHash}`;
    return await cacheService.get<any[]>(key);
  }

  async invalidateSearchResults(queryHash?: string): Promise<number> {
    if (queryHash) {
      const key = `${CACHE_PREFIXES.SEARCH_RESULTS}${queryHash}`;
      const deleted = await cacheService.delete(key);
      return deleted ? 1 : 0;
    } else {
      const pattern = `${CACHE_PREFIXES.SEARCH_RESULTS}*`;
      return await cacheService.deleteByPattern(pattern);
    }
  }

  /**
   * Cache Warming - Preload frequently accessed data
   */
  async warmCache(userId: string): Promise<void> {
    try {
      // This would typically fetch from database and populate cache
      console.log(`Warming cache for user ${userId}`);
      
      // Example: Preload user profile, recent progress, recommended learning paths
      // In a real implementation, you would fetch this data from your database
      // and populate the cache proactively
    } catch (error) {
      console.error('Error warming cache:', error);
    }
  }

  /**
   * Bulk Cache Invalidation
   */
  async invalidateUserData(userId: string): Promise<{
    profileInvalidated: boolean;
    progressInvalidated: number;
    recommendationsInvalidated: boolean;
  }> {
    const [profileInvalidated, progressInvalidated, recommendationsInvalidated] = await Promise.all([
      this.invalidateUserProfile(userId),
      this.invalidateUserProgress(userId),
      this.invalidateRecommendations(userId),
    ]);

    return {
      profileInvalidated,
      progressInvalidated,
      recommendationsInvalidated,
    };
  }

  /**
   * Cache Statistics
   */
  async getCacheStats(): Promise<{
    userProfiles: number;
    userProgress: number;
    learningPaths: number;
    exercises: number;
    codeAnalysis: number;
    recommendations: number;
    searchResults: number;
  }> {
    try {
      const [
        userProfiles,
        userProgress,
        learningPaths,
        exercises,
        codeAnalysis,
        recommendations,
        searchResults,
      ] = await Promise.all([
        this.countKeysByPattern(`${CACHE_PREFIXES.USER_PROFILE}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.USER_PROGRESS}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.LEARNING_PATH}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.EXERCISE}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.CODE_ANALYSIS}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.RECOMMENDATIONS}*`),
        this.countKeysByPattern(`${CACHE_PREFIXES.SEARCH_RESULTS}*`),
      ]);

      return {
        userProfiles,
        userProgress,
        learningPaths,
        exercises,
        codeAnalysis,
        recommendations,
        searchResults,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        userProfiles: 0,
        userProgress: 0,
        learningPaths: 0,
        exercises: 0,
        codeAnalysis: 0,
        recommendations: 0,
        searchResults: 0,
      };
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

  private async countKeysByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.getKeysByPattern(pattern);
      return keys.length;
    } catch (error) {
      console.error('Error counting keys by pattern:', error);
      return 0;
    }
  }
}

export const dataCacheService = new DataCacheService();
export default dataCacheService;