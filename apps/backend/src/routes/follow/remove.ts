import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.delete('/remove', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body
  const currentUserId = req.user!.id

  if (!userId) {
    throw new AppError('userId is required', 400)
  }

  if (userId === currentUserId) {
    throw new AppError('You cannot remove yourself', 400)
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
    .where(and(eq(followers.followerId, userId), eq(followers.followingId, currentUserId)))
    .limit(1)

  if (existingFollow.length === 0) {
    throw new AppError('This user is not following you', 400)
  }

  await db
    .delete(followers)
    .where(and(eq(followers.followerId, userId), eq(followers.followingId, currentUserId)))

  const [followerCount, followingCount] = await Promise.all([
    db.select({ count: followers.id }).from(followers).where(eq(followers.followingId, currentUserId)),
    db.select({ count: followers.id }).from(followers).where(eq(followers.followerId, currentUserId))
  ])

  return ApiResponse.success(res, { 
    isFollowing: false,
    followersCount: followerCount.length,
    followingCount: followingCount.length
  }, 'Successfully removed follower')
}))

export default router
