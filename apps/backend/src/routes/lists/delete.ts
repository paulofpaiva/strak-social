import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { deleteFile } from '../../services/storage'
import { eq, and } from 'drizzle-orm'

const router = Router()

router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id

  const existingList = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (existingList.length === 0) {
    throw new AppError('List not found', 404)
  }

  if (existingList[0].userId !== userId) {
    throw new AppError('You do not have permission to delete this list', 403)
  }

  const coverUrl = existingList[0].coverUrl

  await db
    .delete(lists)
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))

  if (coverUrl) {
    try {
      await deleteFile(coverUrl)
    } catch (error) {
      console.error('Error deleting list cover:', error)
    }
  }

  return ApiResponse.success(res, null, 'List deleted successfully')
}))

export default router

