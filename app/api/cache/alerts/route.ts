import { NextRequest, NextResponse } from 'next/server';
import { cacheMonitoringService } from '@/services/cache-monitoring.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');

    switch (action) {
      case 'monitor':
        // Run monitoring and get new alerts
        const newAlerts = await cacheMonitoringService.monitorAndAlert();
        return NextResponse.json({
          success: true,
          data: {
            newAlerts,
            alertCount: newAlerts.length,
          },
        });

      case 'recent':
      default:
        // Get recent alerts
        const recentAlerts = await cacheMonitoringService.getRecentAlerts(limit);
        return NextResponse.json({
          success: true,
          data: {
            alerts: recentAlerts,
            count: recentAlerts.length,
          },
        });
    }
  } catch (error) {
    console.error('Error getting cache alerts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get cache alerts',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}