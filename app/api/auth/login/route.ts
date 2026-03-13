import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const [rows]: any = await pool.execute(
      'SELECT id, username, full_name, role, password FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Kullanici adi veya sifre hatali' }, { status: 401 });
    }

    const user = rows[0];
    
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Kullanici adi veya sifre hatali' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax'
    });

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role } });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Giris yapilirken bir hata olustu' }, { status: 500 });
  }
}