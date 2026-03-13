import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));

    const [userRows]: any = await pool.execute(
      'SELECT id, username, full_name, role FROM users WHERE id = ?',
      [session.id]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const [permissionRows]: any = await pool.execute(
      'SELECT page_key, is_enabled FROM user_permissions WHERE user_id = ?',
      [session.id]
    );

    const permissions = permissionRows.reduce((acc: any, curr: any) => {
      acc[curr.page_key] = !!curr.is_enabled;
      return acc;
    }, {});

    const user = userRows[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        permissions
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
