import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

// Get current user profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const [rows]: any = await pool.execute(
      'SELECT id, username, full_name, role, email, phone, bio, notifications FROM users WHERE id = ?',
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

// Update current user profile
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();
    const { full_name, email, phone, bio, notifications } = body;

    await pool.execute(
      'UPDATE users SET full_name = ?, email = ?, phone = ?, bio = ?, notifications = ? WHERE id = ?',
      [
        full_name || null, 
        email || null, 
        phone || null, 
        bio || null, 
        notifications ? JSON.stringify(notifications) : null, 
        session.id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
