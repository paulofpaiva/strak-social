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

router.post('/:id/follow', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
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
    throw new AppError('List owner cannot follow their own list', 400)
  }

  if (list[0].isPrivate) {
    throw new AppError('Cannot follow a private list', 403)
  }

  const existingMember = await db
    .select()
    .from(listMembers)
    .where(and(eq(listMembers.listId, listId), eq(listMembers.userId, userId)))
    .limit(1)

  if (existingMember.length > 0) {
    return ApiResponse.success(res, { message: 'Already following this list' }, 'Already following this list')
  }

  await db
    .insert(listMembers)
    .values({
      listId,
      userId,
    })

  return ApiResponse.success(res, null, 'List followed successfully', 201)
}))

export default router

