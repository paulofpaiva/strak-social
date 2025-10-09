import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { followLimiter } from '../../middleware/rateLimiter'

const router = Router()

router.post('/toggle', authenticateToken, followLimiter, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body
  const followerId = req.user!.id

  if (!userId) {
    throw new AppError('userId is required', 400)
  }

  if (userId === followerId) {
    throw new AppError('You cannot follow yourself', 400)
  }

  const userExists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (userExists.length === 0) {
    throw new AppError('User not found', 404)
  }

  const existingFollow = await db
    .select({ id: followers.id })
    .from(followers)
    .where(and(eq(followers.followerId, followerId), eq(followers.followingId, userId)))
    .limit(1)

  if (existingFollow.length > 0) {
    await db
      .delete(followers)
      .where(and(eq(followers.followerId, followerId), eq(followers.followingId, userId)))

    const [followerCount, followingCount] = await Promise.all([
      db.select({ count: followers.id }).from(followers).where(eq(followers.followingId, followerId)),
      db.select({ count: followers.id }).from(followers).where(eq(followers.followerId, followerId))
    ])

    return ApiResponse.success(res, { 
      isFollowing: false,
      followersCount: followerCount.length,
      followingCount: followingCount.length
    }, 'Successfully unfollowed user')
  } else {
    await db
      .insert(followers)
      .values({
        followerId,
        followingId: userId
      })

    // Get updated follower counts
    const [followerCount, followingCount] = await Promise.all([
      db.select({ count: followers.id }).from(followers).where(eq(followers.followingId, followerId)),
      db.select({ count: followers.id }).from(followers).where(eq(followers.followerId, followerId))
    ])

    return ApiResponse.success(res, { 
      isFollowing: true,
      followersCount: followerCount.length,
      followingCount: followingCount.length
    }, 'Successfully followed user')
  }
}))

export default router

