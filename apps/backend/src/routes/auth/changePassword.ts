import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { changePasswordSchema } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.put('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = changePasswordSchema.parse(req.body)
  
  const userResult = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, req.user!.id))
    .limit(1)

  if (userResult.length === 0) {
    throw new AppError('User not found', 404)
  }

  const user = userResult[0]

  const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)
  
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400)
  }

  const saltRounds = 12
  const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, saltRounds)

  await db
    .update(users)
    .set({ 
      password: hashedNewPassword,
      updatedAt: new Date()
    })
    .where(eq(users.id, req.user!.id))

  return ApiResponse.success(res, null, 'Password changed successfully')
}))

export default router

