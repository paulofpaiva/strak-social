import { Router, Request, Response } from 'express'
import { coverUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { uploadFile, generateCoverFilename, deleteFile } from '../../services/storage'
import { coverUploadLimiter } from '../../middleware/rateLimiter'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { eq } from 'drizzle-orm'
import path from 'path'

const router = Router()

router.post('/cover', authenticateToken, coverUploadLimiter, coverUpload.single('cover'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const userId = req.user!.id
  const extension = path.extname(req.file.originalname)
  const filename = generateCoverFilename(userId, extension)

  const currentUser = await db
    .select({ cover: users.cover })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const oldCoverUrl = currentUser[0]?.cover

  let newCoverUrl: string | null = null

  try {
    newCoverUrl = await uploadFile(
      req.file.buffer,
      'covers',
      filename,
      req.file.mimetype
    )

    const updatedUser = await db
      .update(users)
      .set({ cover: newCoverUrl, updatedAt: new Date() })
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

    if (oldCoverUrl) {
      await deleteFile(oldCoverUrl)
    }

    return ApiResponse.successUser(res, updatedUser[0], 'Cover uploaded and updated successfully')
  } catch (error) {
    if (newCoverUrl) {
      await deleteFile(newCoverUrl)
    }
    throw error
  }
}))

router.delete('/cover', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id

  const currentUser = await db
    .select({ cover: users.cover })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const coverUrl = currentUser[0]?.cover

  if (!coverUrl) {
    throw new AppError('No cover to delete', 400)
  }

  const updatedUser = await db
    .update(users)
    .set({ cover: null, updatedAt: new Date() })
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

  await deleteFile(coverUrl)

  return ApiResponse.successUser(res, updatedUser[0], 'Cover deleted successfully')
}))

export default router

