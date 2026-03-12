import { NextResponse } from 'next/server';
import { 
  getHourlyStats, 
  getDeviceStats, 
  getGeoStats, 
  getDemographicStats,
  getDashboardStats 
} from '@/lib/services/db-service';
import { cookies } from 'next/headers';

export async function GET() {
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

    const [hourly, device, geo, demo, stats] = await Promise.all([
      getHourlyStats(userId),
      getDeviceStats(userId),
      getGeoStats(userId),
      getDemographicStats(userId),
      getDashboardStats(userId)
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
