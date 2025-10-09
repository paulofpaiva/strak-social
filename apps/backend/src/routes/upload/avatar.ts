import { Router, Request, Response } from 'express'
import { avatarUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { uploadFile, generateAvatarFilename, deleteFile } from '../../services/storage'
import { avatarUploadLimiter } from '../../middleware/rateLimiter'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { eq } from 'drizzle-orm'
import path from 'path'

const router = Router()

router.post('/avatar', authenticateToken, avatarUploadLimiter, avatarUpload.single('avatar'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const userId = req.user!.id
  const extension = path.extname(req.file.originalname)
  const filename = generateAvatarFilename(userId, extension)

  // Fetch current user to get old avatar URL
  const currentUser = await db
    .select({ avatar: users.avatar })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const oldAvatarUrl = currentUser[0]?.avatar

  let newAvatarUrl: string | null = null

  try {
    // Upload new avatar to Firebase Storage
    newAvatarUrl = await uploadFile(
      req.file.buffer,
      'avatars',
      filename,
      req.file.mimetype
    )

    // Update database with new avatar URL
    const updatedUser = await db
      .update(users)
      .set({ avatar: newAvatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId))
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

    // Delete old avatar from Firebase Storage (after successful DB update)
    if (oldAvatarUrl) {
      await deleteFile(oldAvatarUrl)
    }

    return ApiResponse.successUser(res, updatedUser[0], 'Avatar uploaded and updated successfully')
  } catch (error) {
    // Rollback: If DB update failed, delete the newly uploaded file
    if (newAvatarUrl) {
      await deleteFile(newAvatarUrl)
    }
    throw error
  }
}))

router.delete('/avatar', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id

  const currentUser = await db
    .select({ avatar: users.avatar })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const avatarUrl = currentUser[0]?.avatar

  if (!avatarUrl) {
    throw new AppError('No avatar to delete', 400)
  }

  const updatedUser = await db
    .update(users)
    .set({ avatar: null, updatedAt: new Date() })
    .where(eq(users.id, userId))
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

  await deleteFile(avatarUrl)

  return ApiResponse.successUser(res, updatedUser[0], 'Avatar deleted successfully')
}))

export default router

