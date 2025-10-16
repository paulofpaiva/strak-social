import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listMembers } from '../../schemas/listMembers'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { eq, or, ilike, and, sql } from 'drizzle-orm'

const router = Router()

router.get('/search', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const search = (req.query.q as string) || ''
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const offset = (page - 1) * limit

  const publicLists = await db
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
    .where(
      and(
        eq(lists.isPrivate, false),
        search.trim().length > 0
          ? or(
              ilike(lists.title, `%${search}%`),
              ilike(lists.description, `%${search}%`)
            )
          : undefined
      )
    )
    .limit(limit)
    .offset(offset)

  const listsWithInfo = await Promise.all(
    publicLists.map(async (list) => {
      const membersCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(listMembers)
        .where(eq(listMembers.listId, list.id))

      const membership = await db
        .select()
        .from(listMembers)
        .where(and(eq(listMembers.listId, list.id), eq(listMembers.userId, userId)))
        .limit(1)

      return {
        ...list,
        membersCount: Number(membersCount[0]?.count || 0),
        isMember: membership.length > 0,
        isOwner: list.userId === userId,
      }
    })
  )

  if (search.trim().length === 0) {
    listsWithInfo.sort((a, b) => b.membersCount - a.membersCount)
  }

  return ApiResponse.success(res, {
    lists: listsWithInfo,
    pagination: {
      page,
      limit,
      hasMore: publicLists.length === limit
    }
  }, 'Lists retrieved successfully')
}))

export default router

