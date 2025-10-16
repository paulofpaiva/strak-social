import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listMembers } from '../../schemas/listMembers'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { eq, and } from 'drizzle-orm'

const router = Router()

router.delete('/:id/unfollow', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id

  const list = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (list.length === 0) {
    throw new AppError('List not found', 404)
  }

  if (list[0].userId === userId) {
    throw new AppError('Cannot unfollow your own list. Delete the list instead.', 400)
  }

  const member = await db
    .select()
    .from(listMembers)
    .where(and(eq(listMembers.listId, listId), eq(listMembers.userId, userId)))
    .limit(1)

  if (member.length === 0) {
    return ApiResponse.success(res, { message: 'Not following this list' }, 'Not following this list')
  }

  await db
    .delete(listMembers)
    .where(and(eq(listMembers.listId, listId), eq(listMembers.userId, userId)))

  return ApiResponse.success(res, null, 'List unfollowed successfully')
}))

export default router

