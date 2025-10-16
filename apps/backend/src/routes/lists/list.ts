import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listMembers } from '../../schemas/listMembers'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { eq, or, asc, sql } from 'drizzle-orm'

const router = Router()

router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const offset = (page - 1) * limit

  const userLists = await db
    .selectDistinct({
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
    .leftJoin(listMembers, eq(listMembers.listId, lists.id))
    .where(
      or(
        eq(lists.userId, userId),
        eq(listMembers.userId, userId)
      )
    )
    .orderBy(asc(lists.title))
    .limit(limit)
    .offset(offset)

  const listsWithCounts = await Promise.all(
    userLists.map(async (list) => {
      const membersCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(listMembers)
        .where(eq(listMembers.listId, list.id))

      return {
        ...list,
        membersCount: Number(membersCount[0]?.count || 0),
        isOwner: list.userId === userId,
      }
    })
  )

  return ApiResponse.success(res, {
    lists: listsWithCounts,
    pagination: {
      page,
      limit,
      hasMore: userLists.length === limit
    }
  }, 'Lists retrieved successfully')
}))

export default router

