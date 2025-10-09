import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { signUpSchema } from '../../schemas/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { signUpLimiter } from '../../middleware/rateLimiter'

const router = Router()

router.post('/', signUpLimiter, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signUpSchema.parse(req.body)
  
  const existingEmail = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1)

  if (existingEmail.length > 0) {
    throw new AppError('This email is already registered. Try logging in or use another email.', 400)
  }

  const existingUsername = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, validatedData.username))
    .limit(1)

  if (existingUsername.length > 0) {
    throw new AppError('This username is already taken. Please choose another username.', 400)
  }

  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds)

  const newUser = await db
    .insert(users)
    .values({
      email: validatedData.email,
      username: validatedData.username,
      name: validatedData.name,
      password: hashedPassword,
      birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      avatar: users.avatar,
      cover: users.cover,
      bio: users.bio,
      birthDate: users.birthDate,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

  if (newUser[0].avatar && !newUser[0].avatar.startsWith('http')) {
    const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001'
    newUser[0].avatar = `${baseUrl}${newUser[0].avatar}`
  }

  if (newUser[0].cover && !newUser[0].cover.startsWith('http')) {
    const baseUrl = process.env.VITE_AVATAR_URL || 'http://localhost:3001'
    newUser[0].cover = `${baseUrl}${newUser[0].cover}`
  }

  const token = jwt.sign(
    { 
      userId: newUser[0].id, 
      email: newUser[0].email 
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

  return ApiResponse.createdUser(res, newUser[0], 'User created successfully')
}))

export default router

