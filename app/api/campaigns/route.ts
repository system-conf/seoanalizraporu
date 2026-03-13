import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/services/db-service';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ad_account_id, name, budget, budget_type, image_url } = body;

    const [result]: any = await pool.execute(
      'INSERT INTO campaigns (ad_account_id, name, budget, budget_type, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [ad_account_id, name, budget, budget_type, image_url, 'Aktif']
    );

    return NextResponse.json({ id: result.insertId, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, name, budget } = body;

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (budget !== undefined) {
      updates.push('budget = ?');
      values.push(budget);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.execute(
      `UPDATE campaigns SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    await pool.execute('DELETE FROM campaigns WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
