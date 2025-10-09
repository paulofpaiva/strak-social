import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { bookmarks } from '../../schemas/bookmarks'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { bookmarkLimiter } from '../../middleware/rateLimiter'

const router = Router()

router.post('/:id/bookmark', authenticateToken, bookmarkLimiter, asyncHandler(async (req: Request, res: Response) => {
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

  const existingBookmark = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)))
    .limit(1)

  if (existingBookmark.length > 0) {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)))

    return ApiResponse.success(res, { bookmarked: false }, 'Post unbookmarked successfully')
  } else {
    await db
      .insert(bookmarks)
      .values({
        postId,
        userId
      })

    return ApiResponse.success(res, { bookmarked: true }, 'Post bookmarked successfully')
  }
}))

export default router

