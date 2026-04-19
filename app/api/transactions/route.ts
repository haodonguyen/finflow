import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, user.id))
    .orderBy(desc(transactions.date));

  return NextResponse.json(
    rows.map(t => ({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      category: t.category,
      description: t.description,
      date: t.date.toISOString().split('T')[0],
    }))
  );
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { type, amount, category, description, date } = await request.json();

    if (!type || !amount || !category || !description || !date) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    const rows = await db
      .insert(transactions)
      .values({
        userId: user.id,
        type,
        amount: parsedAmount.toFixed(2),
        category,
        description,
        date: new Date(date + 'T12:00:00'),
      })
      .returning();

    const t = rows[0];
    return NextResponse.json(
      {
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        category: t.category,
        description: t.description,
        date: t.date.toISOString().split('T')[0],
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
