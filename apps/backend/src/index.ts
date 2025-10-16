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
import newsRoutes from './routes/news/index'
import listsRoutes from './routes/lists/index'
import { maskConnectionString } from './utils/database'
import { getApiVersion } from './utils/version'
import { errorHandler, notFound } from './middleware/errorHandler'
import { runAutoMigrations } from './db/autoMigrate'
import { initializeFirebase } from './services/firebase'

dotenv.config()

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',
  'https://monofrontend-production.up.railway.app',
  'https://straksocial.up.railway.app',
]

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`Origin not allowed by CORS: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

const PORT = Number(process.env.PORT) || 3000

app.use('/api/health', healthRouter)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/lists', listsRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await runAutoMigrations()
    
    initializeFirebase()

    app.listen(PORT, () => {
      console.log('Strak Social API')
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
