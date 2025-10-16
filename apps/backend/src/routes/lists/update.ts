import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { eq, and } from 'drizzle-orm'

const router = Router()

router.patch('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id
  const { title, description, coverUrl, isPrivate } = req.body

  const existingList = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (existingList.length === 0) {
    throw new AppError('List not found', 404)
  }

  if (existingList[0].userId !== userId) {
    throw new AppError('You do not have permission to update this list', 403)
  }

  const updateData: any = { updatedAt: new Date() }

  if (title !== undefined) {
    if (title.trim().length === 0) {
      throw new AppError('Title cannot be empty', 400)
    }
    if (title.length > 50) {
      throw new AppError('Title must be at most 50 characters', 400)
    }
    updateData.title = title.trim()
  }

  if (description !== undefined) {
    if (description && description.length > 160) {
      throw new AppError('Description must be at most 160 characters', 400)
    }
    updateData.description = description ? description.trim() : null
  }

  if (coverUrl !== undefined) {
    updateData.coverUrl = coverUrl || null
  }

  if (isPrivate !== undefined) {
    updateData.isPrivate = isPrivate
  }

  const updatedList = await db
    .update(lists)
    .set(updateData)
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))
    .returning()

  return ApiResponse.success(res, { list: updatedList[0] }, 'List updated successfully')
}))

export default router

