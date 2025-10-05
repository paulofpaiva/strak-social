import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { checkUsernameSchema } from '../../schemas/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.query
  
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ 
      success: false,
      available: false,
      message: 'Username is required' 
    })
  }
  
  const validation = checkUsernameSchema.safeParse({ username })
  if (!validation.success) {
    return res.status(400).json({ 
      success: false,
      available: false,
      message: 'Invalid username format' 
    })
  }
  
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  if (existingUser.length > 0) {
    return res.json({ 
      success: true,
      available: false,
      message: 'This username is already taken' 
    })
  }

  return res.json({
    success: true,
    available: true,
    message: 'Username is available'
  })
}))

export default router

