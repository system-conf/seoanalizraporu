import { NextResponse } from 'next/server';
import { 
  getHourlyStats, 
  getDeviceStats, 
  getGeoStats, 
  getDemographicStats,
  getDashboardStats 
} from '@/lib/services/db-service';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let userId: number | undefined = undefined;
    
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        if (session.role === 'customer') {
          userId = session.id;
        }
      } catch (e) {
        console.error('Session Cookie Parse Error:', e);
      }
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const dateRange = searchParams.get('dateRange') || undefined;

    const filters = { userId, accountId, platform, dateRange };

    const [hourly, device, geo, demo, stats] = await Promise.all([
      getHourlyStats(filters),
      getDeviceStats(filters),
      getGeoStats(filters),
      getDemographicStats(filters),
      getDashboardStats(filters)
    ]);

    return NextResponse.json({
      hourly,
      device,
      geo,
      demo,
      stats
    });
  } catch (error: any) {
    console.error('Analytics Data Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data', details: error.message }, { status: 500 });
  }
}
