import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    const [rows]: any = await pool.execute(
      'SELECT id, username, full_name, role, email, phone, bio, notifications, timezone, currency FROM users WHERE id = ?',
      [session.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    const body = await request.json();
    const { full_name, email, phone, bio, notifications, password, timezone, currency } = body;

    if (password) {
      const hashedPassword = await hashPassword(password);
      await pool.execute(
        'UPDATE users SET full_name = ?, email = ?, phone = ?, bio = ?, notifications = ?, password = ?, timezone = ?, currency = ? WHERE id = ?',
        [full_name || null, email || null, phone || null, bio || null, notifications ? JSON.stringify(notifications) : null, hashedPassword, timezone || 'utc+3', currency || 'try', session.id]
      );
    } else {
      await pool.execute(
        'UPDATE users SET full_name = ?, email = ?, phone = ?, bio = ?, notifications = ?, timezone = ?, currency = ? WHERE id = ?',
        [full_name || null, email || null, phone || null, bio || null, notifications ? JSON.stringify(notifications) : null, timezone || 'utc+3', currency || 'try', session.id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}