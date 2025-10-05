import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.put('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { avatar } = req.body
  
  if (!avatar) {
    throw new AppError('Avatar URL is required', 400)
  }

  const updatedUser = await db
    .update(users)
    .set({ avatar, updatedAt: new Date() })
    .where(eq(users.id, req.user!.id))
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

  return ApiResponse.successUser(res, updatedUser[0], 'Avatar updated successfully')
}))

export default router

