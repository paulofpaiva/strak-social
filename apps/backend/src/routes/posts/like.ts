import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { likes } from '../../schemas/likes'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { likeLimiter } from '../../middleware/rateLimiter'

const router = Router()

router.post('/:id/like', authenticateToken, likeLimiter, asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id
  const userId = req.user!.id

  const existingPost = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (existingPost.length === 0) {
    throw new AppError('Post not found', 404)
  }

  const existingLike = await db
    .select({ id: likes.id })
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .limit(1)

  if (existingLike.length > 0) {
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))

    return ApiResponse.success(res, { liked: false }, 'Post unliked successfully')
  } else {
    await db
      .insert(likes)
      .values({
        postId,
        userId
      })

    return ApiResponse.success(res, { liked: true }, 'Post liked successfully')
  }
}))

export default router

