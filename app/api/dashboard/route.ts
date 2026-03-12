import { NextResponse } from 'next/server';
import { getDashboardStats, getDailyTrend, getCampaigns, getPlatformComparison } from '@/lib/services/db-service';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let userId: number | undefined = undefined;
    
    if (sessionCookie) {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (session.role === 'customer') {
        userId = session.id;
      }
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const dateRange = searchParams.get('dateRange') || undefined;

    const filters = { userId, accountId, platform, dateRange };

    const [stats, trend, campaigns, platforms] = await Promise.all([
      getDashboardStats(filters),
      getDailyTrend(filters),
      getCampaigns(filters),
      getPlatformComparison(filters)
    ]);

    return NextResponse.json({
      stats,
      trend,
      campaigns,
      platforms
    });
  } catch (error: any) {
    console.error('Dashboard Data Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data', details: error.message }, { status: 500 });
  }
}
