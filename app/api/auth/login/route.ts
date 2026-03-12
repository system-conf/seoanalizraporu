import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const [rows]: any = await pool.execute(
      'SELECT id, username, full_name, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Kullanici adi veya sifre hatali' }, { status: 401 });
    }

    const user = rows[0];
    
    // Set a simple cookie (not secure for production, but "basit" as requested)
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Giris yapilirken bir hata olustu' }, { status: 500 });
  }
}
