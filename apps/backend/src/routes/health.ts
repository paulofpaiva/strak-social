import { Router, Request, Response } from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import { getApiVersion } from '../utils/version'

dotenv.config()

const router = Router()

let pool: Pool | null = null

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'not_configured'
  let dbError = null

  if (!pool || !process.env.DATABASE_URL) {
    dbStatus = 'not_configured'
    dbError = 'DATABASE_URL not configured'
  } else {
    try {
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = 'disconnected'
      dbError = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  res.json({
    status: 'ok',
    version: getApiVersion(),
    timestamp: new Date().toISOString(),
    port: Number(process.env.PORT) || 3000,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      error: dbError,
    },
  })
})

export default router

