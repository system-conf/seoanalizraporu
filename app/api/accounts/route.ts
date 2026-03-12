import { NextResponse } from 'next/server';
import { getAdAccounts } from '@/lib/services/db-service';
import pool from '@/lib/db';
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

    const accounts = await getAdAccounts(userId);
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Update account (Assign to user - Admin only)
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { account_id, user_id } = await request.json();
    
    await pool.execute(
      'UPDATE ad_accounts SET user_id = ? WHERE id = ?',
      [user_id || null, account_id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
