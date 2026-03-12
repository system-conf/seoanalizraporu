import { NextResponse } from 'next/server';
import { getDashboardStats, getDailyTrend, getCampaigns, getPlatformComparison } from '@/lib/services/db-service';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let userId: number | undefined = undefined;
    
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      // If user is a customer, always filter by their ID
      if (session.role === 'customer') {
        userId = session.id;
      }
      // If admin, we don't filter (sees everything) unless we add specific logic
    }

    const stats = await getDashboardStats(userId);
    const trend = await getDailyTrend(userId);
    const campaigns = await getCampaigns(userId);
    const platforms = await getPlatformComparison(userId);

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
