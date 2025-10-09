import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, ne, and, notInArray, sql } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id
  const limit = parseInt(req.query.limit as string) || 8

  const following = await db
    .select({ followingId: followers.followingId })
    .from(followers)
    .where(eq(followers.followerId, currentUserId))

  const followingIds = following.map(f => f.followingId)

  const suggestedUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      bio: users.bio,
      isVerified: users.isVerified,
      followerCount: sql<number>`count(${followers.id})`.as('follower_count'),
    })
    .from(users)
    .leftJoin(followers, eq(followers.followingId, users.id))
    .where(
      and(
        ne(users.id, currentUserId),
        followingIds.length > 0 ? notInArray(users.id, followingIds) : undefined
      )
    )
    .groupBy(users.id, users.name, users.username, users.avatar, users.bio, users.isVerified)
    .orderBy(sql`count(${followers.id}) DESC`)
    .limit(limit)

  const usersWithFollowStatus = suggestedUsers.map(user => ({
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    isVerified: user.isVerified,
    isFollowing: false,
  }))

  return ApiResponse.success(res, {
    users: usersWithFollowStatus,
  }, 'User suggestions retrieved successfully')
}))

export default router

