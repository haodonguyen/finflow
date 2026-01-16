import { pgTable, text, varchar, decimal, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 10 }).notNull(), // 'income' or 'expense'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  isRecurring: boolean('is_recurring').default(false),
  recurringFrequency: varchar('recurring_frequency', { length: 20 }), // 'daily', 'weekly', 'monthly', 'yearly'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Budgets table
export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  limit: decimal('limit', { precision: 10, scale: 2 }).notNull(),
  month: varchar('month', { length: 7 }).notNull(), // Format: 'YYYY-MM'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;