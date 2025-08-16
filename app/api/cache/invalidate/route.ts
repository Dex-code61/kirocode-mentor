import { NextRequest, NextResponse } from 'next/server';
import { cacheInvalidationService } from '@/services/cache-invalidation.service';
import { cacheService } from '@/services/cache.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, entityId, userId, metadata } = body;

    if (!type || !entityId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type and entityId',
      }, { status: 400 });
    }

    const event = {
      type,
      entityId,
      userId,
      metadata,
      timestamp: new Date(),
    };

    const result = await cacheInvalidationService.invalidate(event);

    return NextResponse.json({
      success: result.success,
      data: {
        invalidatedKeys: result.invalidatedKeys,
        keyCount: result.invalidatedKeys.length,
        errors: result.errors,
      },
    });
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to invalidate cache',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get('pattern');
    const userId = searchParams.get('userId');
    const key = searchParams.get('key');

    if (pattern) {
      // Invalidate by pattern
      const deletedCount = await cacheInvalidationService.invalidateByPattern(pattern);
      return NextResponse.json({
        success: true,
        data: {
          deletedCount,
          message: `Invalidated ${deletedCount} keys matching pattern: ${pattern}`,
        },
      });
    } else if (userId) {
      // Invalidate all user cache
      const result = await cacheInvalidationService.invalidateUserCache(userId);
      return NextResponse.json({
        success: true,
        data: {
          ...result,
          message: `Invalidated cache for user: ${userId}`,
        },
      });
    } else if (key) {
      // Invalidate specific key
      const deleted = await cacheService.delete(key);
      return NextResponse.json({
        success: deleted,
        data: {
          deleted,
          message: deleted ? `Key ${key} deleted` : `Key ${key} not found`,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: pattern, userId, or key',
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting cache:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete cache',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}