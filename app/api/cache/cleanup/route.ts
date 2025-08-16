import { NextRequest, NextResponse } from 'next/server';
import { cacheInvalidationService } from '@/services/cache-invalidation.service';
import { cacheService } from '@/services/cache.service';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'scheduled';

    switch (action) {
      case 'scheduled':
        // Run scheduled cleanup
        const cleanupResult = await cacheInvalidationService.scheduledCleanup();
        return NextResponse.json({
          success: true,
          data: {
            ...cleanupResult,
            message: `Cleanup completed: ${cleanupResult.totalKeysRemoved} keys removed`,
          },
        });

      case 'flush-all':
        // Flush all cache (dangerous operation)
        const flushed = await cacheService.flushAll();
        return NextResponse.json({
          success: flushed,
          data: {
            flushed,
            message: flushed ? 'All cache data flushed' : 'Failed to flush cache',
          },
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: scheduled or flush-all',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error during cache cleanup:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup cache',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}