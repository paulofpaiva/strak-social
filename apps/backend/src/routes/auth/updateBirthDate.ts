import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { updateBirthDateSchema } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.put('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateBirthDateSchema.parse(req.body)
  
  const updatedUser = await db
    .update(users)
    .set({
      birthDate: new Date(validatedData.birthDate),
      updatedAt: new Date()
    })
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
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

  return ApiResponse.successUser(res, updatedUser[0], 'Birth date updated successfully')
}))

export default router

