import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, and, or, ilike } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/:userId/followers', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit
  const search = (req.query.search as string) || ''

  const followersList = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      bio: users.bio,
      isVerified: users.isVerified,
      followerId: followers.id,
      followedAt: followers.createdAt,
    })
    .from(followers)
    .innerJoin(users, eq(followers.followerId, users.id))
    .where(
      search
        ? and(
            eq(followers.followingId, userId),
            or(
              ilike(users.name, `%${search}%`),
              ilike(users.username, `%${search}%`)
            )
          )
        : eq(followers.followingId, userId)
    )
    .limit(limit)
    .offset(offset)

  const followersWithStatus = await Promise.all(
    followersList.map(async (follower) => {
      const isFollowing = await db
        .select({ id: followers.id })
        .from(followers)
        .where(and(eq(followers.followerId, req.user!.id), eq(followers.followingId, follower.id)))
        .limit(1)

      const { followerId, ...followerData } = follower
      return {
        ...followerData,
        isFollowing: isFollowing.length > 0
      }
    })
  )

  return ApiResponse.success(res, {
    followers: followersWithStatus,
    pagination: {
      page,
      limit,
      hasMore: followersList.length === limit
    }
  }, 'Followers retrieved successfully')
}))

export default router

