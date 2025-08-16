import { cacheService, CACHE_PREFIXES, CACHE_TTL } from './cache.service';

export interface UserSession {
  userId: string;
  email: string;
  username: string;
  role: string;
  lastActivity: Date;
  preferences?: any;
}

export interface SessionActivity {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: any;
}

class SessionCacheService {
  /**
   * Store user session in cache
   */
  async setUserSession(sessionId: string, session: UserSession): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    return await cacheService.set(key, session, CACHE_TTL.USER_SESSION);
  }

  /**
   * Get user session from cache
   */
  async getUserSession(sessionId: string): Promise<UserSession | null> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    return await cacheService.get<UserSession>(key);
  }

  /**
   * Update user session activity
   */
  async updateSessionActivity(sessionId: string, activity: Partial<UserSession>): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    const existingSession = await this.getUserSession(sessionId);
    
    if (!existingSession) {
      return false;
    }

    const updatedSession = {
      ...existingSession,
      ...activity,
      lastActivity: new Date(),
    };

    return await cacheService.set(key, updatedSession, CACHE_TTL.USER_SESSION);
  }

  /**
   * Delete user session from cache
   */
  async deleteUserSession(sessionId: string): Promise<boolean> {
    const key = `${CACHE_PREFIXES.USER_SESSION}${sessionId}`;
    return await cacheService.delete(key);
  }

  /**
   * Get all active sessions for a user
   */
  async getUserActiveSessions(userId: string): Promise<UserSession[]> {
    try {
      const pattern = `${CACHE_PREFIXES.USER_SESSION}*`;
      const keys = await this.getKeysByPattern(pattern);
      
      if (keys.length === 0) return [];

      const sessions = await cacheService.mget<UserSession>(keys);
      
      return sessions
        .filter((session): session is UserSession => 
          session !== null && session.userId === userId
        );
    } catch (error) {
      console.error('Error getting user active sessions:', error);
      return [];
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateUserSessions(userId: string): Promise<number> {
    try {
      const activeSessions = await this.getUserActiveSessions(userId);
      let deletedCount = 0;

      for (const session of activeSessions) {
        // Find session ID by matching session data
        const pattern = `${CACHE_PREFIXES.USER_SESSION}*`;
        const keys = await this.getKeysByPattern(pattern);
        
        for (const key of keys) {
          const cachedSession = await cacheService.get<UserSession>(key);
          if (cachedSession && cachedSession.userId === userId) {
            const deleted = await cacheService.delete(key);
            if (deleted) deletedCount++;
          }
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error invalidating user sessions:', error);
      return 0;
    }
  }

  /**
   * Track user activity
   */
  async trackActivity(userId: string, activity: SessionActivity): Promise<boolean> {
    const key = `activity:${userId}:${Date.now()}`;
    return await cacheService.set(key, activity, 60 * 60); // 1 hour TTL
  }

  /**
   * Get recent user activities
   */
  async getRecentActivities(userId: string, limit: number = 10): Promise<SessionActivity[]> {
    try {
      const pattern = `activity:${userId}:*`;
      const keys = await this.getKeysByPattern(pattern);
      
      if (keys.length === 0) return [];

      // Sort keys by timestamp (descending)
      const sortedKeys = keys
        .sort((a, b) => {
          const timestampA = parseInt(a.split(':')[2]);
          const timestampB = parseInt(b.split(':')[2]);
          return timestampB - timestampA;
        })
        .slice(0, limit);

      const activities = await cacheService.mget<SessionActivity>(sortedKeys);
      
      return activities.filter((activity): activity is SessionActivity => activity !== null);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const pattern = `${CACHE_PREFIXES.USER_SESSION}*`;
      const keys = await this.getKeysByPattern(pattern);
      let cleanedCount = 0;

      for (const key of keys) {
        const session = await cacheService.get<UserSession>(key);
        if (session) {
          const lastActivity = new Date(session.lastActivity);
          const now = new Date();
          const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

          // Remove sessions inactive for more than 24 hours
          if (hoursSinceActivity > 24) {
            const deleted = await cacheService.delete(key);
            if (deleted) cleanedCount++;
          }
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(): Promise<{
    totalActiveSessions: number;
    uniqueUsers: number;
    averageSessionDuration: number;
  }> {
    try {
      const pattern = `${CACHE_PREFIXES.USER_SESSION}*`;
      const keys = await this.getKeysByPattern(pattern);
      
      if (keys.length === 0) {
        return {
          totalActiveSessions: 0,
          uniqueUsers: 0,
          averageSessionDuration: 0,
        };
      }

      const sessions = await cacheService.mget<UserSession>(keys);
      const validSessions = sessions.filter((session): session is UserSession => session !== null);
      
      const uniqueUsers = new Set(validSessions.map(session => session.userId)).size;
      
      const now = new Date();
      const totalDuration = validSessions.reduce((sum, session) => {
        const lastActivity = new Date(session.lastActivity);
        return sum + (now.getTime() - lastActivity.getTime());
      }, 0);
      
      const averageSessionDuration = validSessions.length > 0 
        ? totalDuration / validSessions.length / (1000 * 60) // in minutes
        : 0;

      return {
        totalActiveSessions: validSessions.length,
        uniqueUsers,
        averageSessionDuration,
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalActiveSessions: 0,
        uniqueUsers: 0,
        averageSessionDuration: 0,
      };
    }
  }

  /**
   * Helper method to get keys by pattern
   */
  private async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      // Note: In production, consider using SCAN instead of KEYS for better performance
      return await (redis as any).keys(pattern);
    } catch (error) {
      console.error('Error getting keys by pattern:', error);
      return [];
    }
  }
}

export const sessionCacheService = new SessionCacheService();
export default sessionCacheService;