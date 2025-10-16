import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listMembers } from '../../schemas/listMembers'
import { listPosts } from '../../schemas/listPosts'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { eq, sql } from 'drizzle-orm'

const router = Router()

router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id

  const list = await db
    .select({
      id: lists.id,
      userId: lists.userId,
      title: lists.title,
      description: lists.description,
      coverUrl: lists.coverUrl,
      isPrivate: lists.isPrivate,
      createdAt: lists.createdAt,
      updatedAt: lists.updatedAt,
      owner: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        isVerified: users.isVerified,
      }
    })
    .from(lists)
    .innerJoin(users, eq(lists.userId, users.id))
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

  const membership = await db
    .select()
    .from(listMembers)
    .where(eq(listMembers.listId, listId))
    .limit(1)

  const isMember = membership.some(m => m.userId === userId)

  const membersCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(listMembers)
    .where(eq(listMembers.listId, listId))

  const postsCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(listPosts)
    .where(eq(listPosts.listId, listId))

  return ApiResponse.success(res, {
    list: {
      ...listData,
      membersCount: Number(membersCount[0]?.count || 0),
      postsCount: Number(postsCount[0]?.count || 0),
      isOwner,
      isMember,
    }
  }, 'List retrieved successfully')
}))

export default router

