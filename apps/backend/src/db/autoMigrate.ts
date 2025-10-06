import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

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
    // Resolve migrations folder robustly across different CWDs/containers
    const candidates = [
      path.resolve(__dirname, '../../drizzle'), // apps/backend/dist -> ../../drizzle
      path.resolve(__dirname, '../drizzle'),
      path.resolve(__dirname, '../../../drizzle'),
      path.resolve(process.cwd(), 'drizzle'),
      path.resolve(process.cwd(), 'apps/backend/drizzle'),
      process.env.MIGRATIONS_DIR || ''
    ].filter(Boolean)

    const migrationsFolder = candidates.find((p) => {
      try {
        return fs.existsSync(path.join(p as string, 'meta', '_journal.json'))
      } catch {
        return false
      }
    }) as string | undefined

    if (!migrationsFolder) {
      throw new Error('Could not locate drizzle migrations folder (meta/_journal.json not found)')
    }

    await migrate(db, { migrationsFolder })
    console.log('Auto-migrations completed')
    await pool.end()
  } catch (error) {
    console.error('Auto-migration failed:', error)
    await pool.end()
    throw error
  }
}

