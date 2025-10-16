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

router.delete('/:id/members/:userId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id
  const listId = req.params.id
  const memberUserId = req.params.userId

  const list = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (list.length === 0) {
    throw new AppError('List not found', 404)
  }

  const isOwner = list[0].userId === currentUserId
  const isRemovingSelf = currentUserId === memberUserId

  if (!isOwner && !isRemovingSelf) {
    throw new AppError('You do not have permission to remove this member', 403)
  }

  if (isOwner && isRemovingSelf) {
    throw new AppError('List owner cannot be removed as a member. Delete the list instead.', 400)
  }

  const member = await db
    .select()
    .from(listMembers)
    .where(and(eq(listMembers.listId, listId), eq(listMembers.userId, memberUserId)))
    .limit(1)

  if (member.length === 0) {
    throw new AppError('User is not a member of this list', 404)
  }

  await db
    .delete(listMembers)
    .where(and(eq(listMembers.listId, listId), eq(listMembers.userId, memberUserId)))

  return ApiResponse.success(res, null, 'Member removed successfully')
}))

export default router

