import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, ilike, or, and, ne } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/users', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { q: query, limit = 10 } = req.query
  const currentUserId = req.user!.id

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return ApiResponse.success(res, { users: [] }, 'Search query is required')
  }

  const searchTerm = `%${query.trim()}%`

  const searchResults = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        ne(users.id, currentUserId),
        or(
          ilike(users.name, searchTerm),
          ilike(users.username, searchTerm)
        )
      )
    )
    .limit(parseInt(limit as string))

  return ApiResponse.success(res, { users: searchResults }, 'Users found successfully')
}))

export default router

