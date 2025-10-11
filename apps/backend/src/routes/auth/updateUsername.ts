import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { updateUsernameSchema } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, and, ne } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.put('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateUsernameSchema.parse(req.body)
  
  const existingUsername = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.username, validatedData.username),
        ne(users.id, req.user!.id)
      )
    )
    .limit(1)

  if (existingUsername.length > 0) {
    throw new AppError('This username is already taken. Please choose another username.', 400)
  }
  
  const updatedUser = await db
    .update(users)
    .set({
      username: validatedData.username,
      updatedAt: new Date()
    })
    .where(eq(users.id, req.user!.id))
    .returning({
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
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

  return ApiResponse.successUser(res, updatedUser[0], 'Username updated successfully')
}))

export default router

