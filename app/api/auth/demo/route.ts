import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, transactions, budgets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '@/lib/auth';

const DEMO_EMAIL = 'demo@finflow.app';
const DEMO_NAME = 'Alex Rivera';

// Returns a Date object at noon N days before now (avoids timezone edge cases)
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

const SEED_TRANSACTIONS = [
  // --- Current month (0–19 days ago) ---
  { type: 'income',  amount: '5500.00', category: 'Salary',        description: 'Monthly Salary',          daysBack: 19 },
  { type: 'expense', amount: '1200.00', category: 'Bills',          description: 'Rent & Utilities',         daysBack: 18 },
  { type: 'expense', amount: '94.50',   category: 'Food',           description: 'Weekly Groceries',         daysBack: 16 },
  { type: 'expense', amount: '85.00',   category: 'Transport',      description: 'Monthly Transit Pass',     daysBack: 14 },
  { type: 'expense', amount: '60.00',   category: 'Health',         description: 'Gym Membership',           daysBack: 12 },
  { type: 'expense', amount: '48.20',   category: 'Food',           description: 'Lunch & Coffee',           daysBack: 10 },
  { type: 'expense', amount: '28.97',   category: 'Entertainment',  description: 'Streaming Services',       daysBack: 8  },
  { type: 'expense', amount: '76.40',   category: 'Food',           description: 'Dinner with Friends',      daysBack: 6  },
  { type: 'expense', amount: '142.80',  category: 'Shopping',       description: 'Online Shopping',          daysBack: 4  },
  { type: 'expense', amount: '23.50',   category: 'Transport',      description: 'Ride-share',               daysBack: 2  },
  { type: 'expense', amount: '88.30',   category: 'Food',           description: 'Weekend Groceries',        daysBack: 1  },
  { type: 'income',  amount: '800.00',  category: 'Freelance',      description: 'Website Consulting',       daysBack: 0  },

  // --- Previous month (20–49 days ago) ---
  { type: 'income',  amount: '5500.00', category: 'Salary',        description: 'Monthly Salary',           daysBack: 49 },
  { type: 'expense', amount: '1200.00', category: 'Bills',         description: 'Rent & Utilities',          daysBack: 48 },
  { type: 'expense', amount: '112.30',  category: 'Food',          description: 'Grocery Run',               daysBack: 44 },
  { type: 'expense', amount: '150.00',  category: 'Health',        description: 'Dentist Visit',             daysBack: 42 },
  { type: 'expense', amount: '95.40',   category: 'Transport',     description: 'Gas & Parking',             daysBack: 40 },
  { type: 'expense', amount: '189.99',  category: 'Shopping',      description: 'New Trainers',              daysBack: 37 },
  { type: 'income',  amount: '1200.00', category: 'Freelance',     description: 'App Development Project',   daysBack: 35 },
  { type: 'expense', amount: '85.00',   category: 'Entertainment', description: 'Concert Tickets',           daysBack: 33 },
  { type: 'expense', amount: '134.50',  category: 'Food',          description: 'Meal Prep & Dining Out',    daysBack: 30 },
  { type: 'expense', amount: '94.00',   category: 'Shopping',      description: 'Spring Wardrobe',           daysBack: 27 },
  { type: 'expense', amount: '98.20',   category: 'Food',          description: 'Groceries',                 daysBack: 24 },
  { type: 'expense', amount: '32.50',   category: 'Entertainment', description: 'Movie Night',               daysBack: 21 },

  // --- Two months ago (50–79 days ago) ---
  { type: 'income',  amount: '5500.00', category: 'Salary',        description: 'Monthly Salary',            daysBack: 79 },
  { type: 'expense', amount: '1200.00', category: 'Bills',         description: 'Rent & Utilities',           daysBack: 78 },
  { type: 'expense', amount: '108.40',  category: 'Food',          description: 'Groceries',                  daysBack: 74 },
  { type: 'expense', amount: '102.30',  category: 'Transport',     description: 'Monthly Pass & Fuel',        daysBack: 71 },
  { type: 'expense', amount: '120.00',  category: 'Shopping',      description: "Valentine's Gift",           daysBack: 68 },
  { type: 'expense', amount: '95.80',   category: 'Food',          description: 'Weekly Shop',                daysBack: 65 },
  { type: 'expense', amount: '45.00',   category: 'Health',        description: 'Pharmacy & Supplements',     daysBack: 62 },
  { type: 'expense', amount: '52.00',   category: 'Entertainment', description: 'Streaming & Games',          daysBack: 59 },
  { type: 'expense', amount: '88.60',   category: 'Food',          description: 'Dining Out',                 daysBack: 56 },
  { type: 'income',  amount: '380.00',  category: 'Investment',    description: 'Dividend Income',            daysBack: 51 },
];

// Budget limits for the current month
const SEED_BUDGETS = [
  { category: 'Food',          limit: '300.00' },
  { category: 'Transport',     limit: '150.00' },
  { category: 'Entertainment', limit: '100.00' },
  { category: 'Bills',         limit: '1400.00' },
  { category: 'Shopping',      limit: '250.00' },
  { category: 'Health',        limit: '120.00' },
];

export async function POST() {
  try {
    // Find or create demo user
    let demoUser = (
      await db.select().from(users).where(eq(users.email, DEMO_EMAIL)).limit(1)
    )[0];

    if (!demoUser) {
      const hashed = await hashPassword('demo-only-no-login');
      const rows = await db
        .insert(users)
        .values({ name: DEMO_NAME, email: DEMO_EMAIL, password: hashed })
        .returning();
      demoUser = rows[0];
    }

    // Reset demo data so every visitor sees a clean slate
    await db.delete(transactions).where(eq(transactions.userId, demoUser.id));
    await db.delete(budgets).where(eq(budgets.userId, demoUser.id));

    // Seed transactions
    await db.insert(transactions).values(
      SEED_TRANSACTIONS.map(t => ({
        userId: demoUser.id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: daysAgo(t.daysBack),
      }))
    );

    // Seed budgets for the current month
    const month = new Date().toISOString().slice(0, 7);
    await db.insert(budgets).values(
      SEED_BUDGETS.map(b => ({
        userId: demoUser.id,
        category: b.category,
        limit: b.limit,
        month,
      }))
    );

    const token = generateToken({
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2-hour demo session
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to start demo' }, { status: 500 });
  }
}
