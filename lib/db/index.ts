import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.POSTGRES_URL) {
  throw new Error(
    'POSTGRES_URL environment variable is not set. Please add it to your .env.local file.\n' +
    'Format: postgresql://username:password@hostname/database?sslmode=require'
  );
}

const sql = neon(process.env.POSTGRES_URL);
export const db = drizzle(sql, { schema });

// Helper function to initialize database tables
export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        recurring_frequency VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create budgets table
    await sql`
      CREATE TABLE IF NOT EXISTS budgets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        "limit" DECIMAL(10, 2) NOT NULL,
        month VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    console.log('✅ Database tables initialized');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}