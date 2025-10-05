import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, sql } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/username/:username', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params
  
  if (!username) {
    throw new AppError('Username is required', 400)
  }

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      avatar: users.avatar,
      cover: users.cover,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  if (user.length === 0) {
    throw new AppError('User not found', 404)
  }

  const userData = user[0]

  const followersCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followingId, userData.id))

  const followingCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followerId, userData.id))

  return ApiResponse.success(res, {
    ...userData,
    followersCount: followersCount[0]?.count || 0,
    followingCount: followingCount[0]?.count || 0
  }, 'User retrieved successfully')
}))

export default router

