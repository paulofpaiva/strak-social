import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../db/index'
import { users } from '../schemas/auth'
import { eq } from 'drizzle-orm'

interface JwtPayload {
  userId: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        username: string
        name: string
        avatar: string | null
        cover: string | null
        bio: string | null
        location: string | null
        website: string | null
        birthDate: Date | null
        createdAt: Date
        updatedAt: Date
      }
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.auth_token

    if (!token) {
      return res.status(401).json({ error: 'Access token not provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        location: users.location,
        website: users.website,
        birthDate: users.birthDate,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }

    if (userResult[0].avatar && !userResult[0].avatar.startsWith('http')) {
      const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001';
      userResult[0].avatar = `${baseUrl}${userResult[0].avatar}`;
    }

    if (userResult[0].cover && !userResult[0].cover.startsWith('http')) {
      const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001';
      userResult[0].cover = `${baseUrl}${userResult[0].cover}`;
    }

    req.user = userResult[0]
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' })
    }
    
    console.error('Authentication error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.auth_token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      
      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          username: users.username,
          name: users.name,
          avatar: users.avatar,
          cover: users.cover,
          bio: users.bio,
          location: users.location,
          website: users.website,
          birthDate: users.birthDate,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1)

      if (userResult.length > 0) {
        if (userResult[0].avatar && !userResult[0].avatar.startsWith('http')) {
          const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001';
          userResult[0].avatar = `${baseUrl}${userResult[0].avatar}`;
        }

        if (userResult[0].cover && !userResult[0].cover.startsWith('http')) {
          const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001';
          userResult[0].cover = `${baseUrl}${userResult[0].cover}`;
        }
        req.user = userResult[0]
      }
    }
    
    next()
  } catch (error) {
    next()
  }
}
