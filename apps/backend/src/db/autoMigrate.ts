import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const runAutoMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not configured - skipping migrations')
    return
  }

  console.log('Running auto-migrations...')

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const db = drizzle(pool)

  try {
    const migrationsFolder = path.resolve(__dirname, '../../drizzle')
    await migrate(db, { migrationsFolder })
    console.log('Auto-migrations completed')
    await pool.end()
  } catch (error) {
    console.error('Auto-migration failed:', error)
    await pool.end()
    throw error
  }
}

