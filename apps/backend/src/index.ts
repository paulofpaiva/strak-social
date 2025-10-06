import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import healthRouter from './routes/health'
import authRoutes from './routes/auth/index'
import postsRoutes from './routes/posts/index'
import commentsRoutes from './routes/comments/index'
import followRoutes from './routes/follow/index'
import usersRoutes from './routes/users/index'
import searchRoutes from './routes/search/index'
import uploadRoutes from './routes/upload/index'
import serveRouter from './routes/upload/serve'
import { maskConnectionString } from './utils/database'
import { getApiVersion } from './utils/version'
import { errorHandler, notFound } from './middleware/errorHandler'
import { runAutoMigrations } from './db/autoMigrate'

dotenv.config()

const app = express()

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

const PORT = Number(process.env.PORT) || 3000

app.use('/', serveRouter)

app.use('/api/health', healthRouter)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/upload', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await runAutoMigrations()

    app.listen(PORT, () => {
      console.log('\nStrak Social API')
      console.log(`URL:         http://localhost:${PORT}`)
      console.log(`Version:     ${getApiVersion()}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`Database:    ${process.env.DATABASE_URL ? maskConnectionString(process.env.DATABASE_URL) : 'not configured'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
