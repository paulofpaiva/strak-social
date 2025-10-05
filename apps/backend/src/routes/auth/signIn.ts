import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { signInSchema } from '../../schemas/auth'
import { eq, or } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signInSchema.parse(req.body)
  
  const userResult = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      password: users.password,
      avatar: users.avatar,
      cover: users.cover,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(or(
      eq(users.email, validatedData.emailOrUsername),
      eq(users.username, validatedData.emailOrUsername)
    ))
    .limit(1)

  if (userResult.length === 0) {
    throw new AppError('Incorrect email/username or password', 401)
  }

  const user = userResult[0]

  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)
  
  if (!isPasswordValid) {
    throw new AppError('Incorrect email/username or password', 401)
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  const { password, ...userWithoutPassword } = user

  return ApiResponse.successUser(res, userWithoutPassword, 'Login successful')
}))

export default router

