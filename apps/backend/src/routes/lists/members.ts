import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listMembers } from '../../schemas/listMembers'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { eq, and, or, ilike } from 'drizzle-orm'

const router = Router()

router.get('/:id/members', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const offset = (page - 1) * limit
  const search = req.query.search as string || ''

  const list = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (list.length === 0) {
    throw new AppError('List not found', 404)
  }

  const listData = list[0]

  const isOwner = listData.userId === userId

  if (listData.isPrivate && !isOwner) {
    throw new AppError('You do not have permission to view this list', 403)
  }

  const owner = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.id, listData.userId))
    .limit(1)

  const searchCondition = search.trim().length > 0 
    ? or(
        ilike(users.name, `%${search}%`),
        ilike(users.username, `%${search}%`)
      )
    : undefined

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      isVerified: users.isVerified,
      joinedAt: listMembers.createdAt,
    })
    .from(listMembers)
    .innerJoin(users, eq(listMembers.userId, users.id))
    .where(
      searchCondition 
        ? and(eq(listMembers.listId, listId), searchCondition)
        : eq(listMembers.listId, listId)
    )
    .limit(limit)
    .offset(offset)

  return ApiResponse.success(res, {
    owner: owner[0] || null,
    members,
    pagination: {
      page,
      limit,
      hasMore: members.length === limit
    }
  }, 'List members retrieved successfully')
}))

export default router

