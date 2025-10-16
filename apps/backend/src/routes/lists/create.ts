import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const { title, description, coverUrl, isPrivate } = req.body

  if (!title || title.trim().length === 0) {
    throw new AppError('Title is required', 400)
  }

  if (title.length > 50) {
    throw new AppError('Title must be at most 50 characters', 400)
  }

  if (description && description.length > 160) {
    throw new AppError('Description must be at most 160 characters', 400)
  }

  const newList = await db
    .insert(lists)
    .values({
      userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      coverUrl: coverUrl || null,
      isPrivate: isPrivate || false,
    })
    .returning()

  return ApiResponse.success(res, { list: newList[0] }, 'List created successfully', 201)
}))

export default router

