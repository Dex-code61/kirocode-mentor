import { NextRequest, NextResponse } from 'next/server';
import { cacheMonitoringService } from '@/services/cache-monitoring.service';
import { cacheService } from '@/services/cache.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';

    switch (type) {
      case 'summary':
        const metrics = await cacheMonitoringService.getPerformanceMetrics();
        return NextResponse.json({
          success: true,
          data: metrics,
        });

      case 'health':
        const health = await cacheMonitoringService.getHealthStatus();
        return NextResponse.json({
          success: true,
          data: health,
        });

      case 'report':
        const report = await cacheMonitoringService.generatePerformanceReport();
        return NextResponse.json({
          success: true,
          data: report,
        });

      case 'basic':
        const basicMetrics = await cacheService.getMetrics();
        return NextResponse.json({
          success: true,
          data: basicMetrics,
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid metrics type. Use: summary, health, report, or basic',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error getting cache metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get cache metrics',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'reset-metrics':
        const resetSuccess = await cacheService.resetMetrics();
        return NextResponse.json({
          success: resetSuccess,
          message: resetSuccess ? 'Cache metrics reset successfully' : 'Failed to reset cache metrics',
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: reset-metrics',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error resetting cache metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset cache metrics',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}