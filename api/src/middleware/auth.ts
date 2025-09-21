import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../db/index.js'
import { users } from '../schemas/auth.js'
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
        name: string
      }
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    req.user = userResult[0]
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expirado' })
    }
    
    console.error('Erro na autenticação:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      
      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1)

      if (userResult.length > 0) {
        req.user = userResult[0]
      }
    }
    
    next()
  } catch (error) {
    // Se houver erro, continua sem autenticação
    next()
  }
}
