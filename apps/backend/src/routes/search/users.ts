import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { users } from '../../schemas/auth'
import { followers } from '../../schemas/followers'
import { authenticateToken } from '../../middleware/auth'
import { eq, ilike, or, and, ne } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/users', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { q: query } = req.query
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit
  const currentUserId = req.user!.id

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return ApiResponse.success(res, { 
      users: [],
      pagination: {
        page,
        limit,
        hasMore: false
      }
    }, 'Search query is required')
  }

  const searchTerm = `%${query.trim()}%`

  const searchResults = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      bio: users.bio,
      isVerified: users.isVerified,
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
    .limit(limit)
    .offset(offset)

  const getImageUrl = (src?: string | null) => {
    if (!src) return null
    
    if (src.startsWith('http') || src.startsWith('blob:')) return src
    
    if (src.startsWith('/uploads/')) {
      return `${process.env.VITE_AVATAR_URL || 'http://localhost:3001'}${src}`
    }
    
    return `${process.env.VITE_AVATAR_URL || 'http://localhost:3001'}/uploads/${src.includes('avatar') ? 'avatars' : 'covers'}/${src}`
  }

  const usersWithFollowStatus = await Promise.all(
    searchResults.map(async (user) => {
      const isFollowing = await db
        .select({ id: followers.id })
        .from(followers)
        .where(and(eq(followers.followerId, currentUserId), eq(followers.followingId, user.id)))
        .limit(1)

      return {
        ...user,
        avatar: getImageUrl(user.avatar),
        isFollowing: isFollowing.length > 0
      }
    })
  )

  return ApiResponse.success(res, {
    users: usersWithFollowStatus,
    pagination: {
      page,
      limit,
      hasMore: searchResults.length === limit
    }
  }, 'Users found successfully')
}))

export default router

