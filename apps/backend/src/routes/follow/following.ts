import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, and, or, ilike } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/:userId/following', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit
  const search = (req.query.search as string) || ''

  const followingList = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      bio: users.bio,
      isVerified: users.isVerified,
      followingId: followers.id,
      followedAt: followers.createdAt,
    })
    .from(followers)
    .innerJoin(users, eq(followers.followingId, users.id))
    .where(
      search
        ? and(
            eq(followers.followerId, userId),
            or(
              ilike(users.name, `%${search}%`),
              ilike(users.username, `%${search}%`)
            )
          )
        : eq(followers.followerId, userId)
    )
    .limit(limit)
    .offset(offset)

  const followingWithStatus = await Promise.all(
    followingList.map(async (following) => {
      const isFollowing = await db
        .select({ id: followers.id })
        .from(followers)
        .where(and(eq(followers.followerId, req.user!.id), eq(followers.followingId, following.id)))
        .limit(1)

      const { followingId, ...followingData } = following
      return {
        ...followingData,
        isFollowing: isFollowing.length > 0
      }
    })
  )

  return ApiResponse.success(res, {
    following: followingWithStatus,
    pagination: {
      page,
      limit,
      hasMore: followingList.length === limit
    }
  }, 'Following retrieved successfully')
}))

export default router

