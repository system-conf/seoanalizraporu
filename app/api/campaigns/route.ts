import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/services/db-service';
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

    const campaigns = await getCampaigns(filters);
    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
