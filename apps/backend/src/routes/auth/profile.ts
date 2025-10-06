import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { updateProfileSchema } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, sql, and, ne } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

// GET profile
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const followersCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followingId, req.user!.id))

  const followingCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(followers)
    .where(eq(followers.followerId, req.user!.id))

  return ApiResponse.successUser(res, {
    ...req.user,
    followersCount: followersCount[0]?.count || 0,
    followingCount: followingCount[0]?.count || 0
  }, 'User profile')
}))

// PUT profile
router.put('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateProfileSchema.parse(req.body)
  const { bio, location, website } = validatedData

  if (bio === undefined && location === undefined && website === undefined) {
    throw new AppError('At least one field (bio, location or website) must be provided', 400)
  }

  const updateData: any = {}
  if (bio !== undefined) updateData.bio = bio
  if (location !== undefined) updateData.location = location
  if (website !== undefined) updateData.website = website
  updateData.updatedAt = new Date()

  const updatedUser = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, req.user!.id))
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      avatar: users.avatar,
      cover: users.cover,
      bio: users.bio,
      location: users.location,
      website: users.website,
      birthDate: users.birthDate,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

  return ApiResponse.successUser(res, updatedUser[0], 'Profile updated successfully')
}))

export default router

