import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/check/:userId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const followerId = req.user!.id

  const isFollowing = await db
    .select({ id: followers.id })
    .from(followers)
    .where(and(eq(followers.followerId, followerId), eq(followers.followingId, userId)))
    .limit(1)

  return ApiResponse.success(res, { isFollowing: isFollowing.length > 0 }, 'Follow status retrieved')
}))

export default router

