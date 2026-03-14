import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie.value));

    // Get billing info
    const [billingRows]: any = await pool.execute(
      'SELECT * FROM billing WHERE user_id = ?',
      [session.id]
    );

    // Get invoices
    const [invoiceRows]: any = await pool.execute(
      'SELECT * FROM invoices WHERE user_id = ? ORDER BY invoice_date DESC',
      [session.id]
    );

    const billing = billingRows.length > 0 ? billingRows[0] : {
      plan_name: 'Basic Plan',
      plan_price: 0.00,
      billing_cycle: 'monthly',
      payment_method: null,
      card_last4: null,
      card_expiry: null,
      card_holder: null,
      next_billing_date: null
    };

    return NextResponse.json({
      billing,
      invoices: invoiceRows
    });
  } catch (error: any) {
    console.error('Billing fetch error:', error);
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
    const { payment_method, card_last4, card_expiry, card_holder } = body;

    // Check if billing record exists
    const [existing]: any = await pool.execute(
      'SELECT id FROM billing WHERE user_id = ?',
      [session.id]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE billing SET payment_method = ?, card_last4 = ?, card_expiry = ?, card_holder = ? WHERE user_id = ?',
        [payment_method || null, card_last4 || null, card_expiry || null, card_holder || null, session.id]
      );
    } else {
      await pool.execute(
        `INSERT INTO billing (user_id, payment_method, card_last4, card_expiry, card_holder, plan_name, plan_price, billing_cycle, next_billing_date)
         VALUES (?, ?, ?, ?, ?, 'Basic Plan', 0.00, 'monthly', DATE_ADD(CURDATE(), INTERVAL 1 MONTH))`,
        [session.id, payment_method || null, card_last4 || null, card_expiry || null, card_holder || null]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Billing update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}