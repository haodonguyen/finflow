import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { budgets } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const month = currentMonth();
  const rows = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.userId, user.id), eq(budgets.month, month)));

  return NextResponse.json(
    rows.map(b => ({ category: b.category, limit: parseFloat(b.limit) }))
  );
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { category, limit } = await request.json();
    if (!category || limit === undefined) {
      return NextResponse.json({ error: 'Category and limit are required' }, { status: 400 });
    }

    const month = currentMonth();
    const existing = await db
      .select({ id: budgets.id })
      .from(budgets)
      .where(
        and(eq(budgets.userId, user.id), eq(budgets.month, month), eq(budgets.category, category))
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(budgets)
        .set({ limit: parseFloat(limit).toFixed(2) })
        .where(
          and(eq(budgets.userId, user.id), eq(budgets.month, month), eq(budgets.category, category))
        );
    } else {
      await db.insert(budgets).values({
        userId: user.id,
        category,
        limit: parseFloat(limit).toFixed(2),
        month,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
