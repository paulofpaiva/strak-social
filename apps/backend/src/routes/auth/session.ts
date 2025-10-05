import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { followers } from '../../schemas/followers'
import { optionalAuth } from '../../middleware/auth'
import { eq, sql } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    })
  }

  const followersCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followingId, req.user.id))

  const followingCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followerId, req.user.id))

  return ApiResponse.successUser(res, {
    ...req.user,
    followersCount: followersCount[0]?.count || 0,
    followingCount: followingCount[0]?.count || 0
  }, 'Session retrieved')
}))

export default router

