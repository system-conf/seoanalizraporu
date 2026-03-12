import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/services/db-service';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let userId: number | undefined = undefined;
    
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === 'customer') {
        userId = session.id;
      }
    }

    const campaigns = await getCampaigns(userId);
    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
