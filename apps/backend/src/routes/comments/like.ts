import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { commentLikes } from '../../schemas/commentLikes'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { likeLimiter } from '../../middleware/rateLimiter'

const router = Router()

router.post('/:commentId/like', authenticateToken, likeLimiter, asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.commentId
  const userId = req.user!.id

  const existingComment = await db
    .select({ id: comments.id })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (existingComment.length === 0) {
    throw new AppError('Comment not found', 404)
  }

  const existingLike = await db
    .select({ id: commentLikes.id })
    .from(commentLikes)
    .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))
    .limit(1)

  if (existingLike.length > 0) {
    await db
      .delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))

    return ApiResponse.success(res, { liked: false }, 'Comment unliked successfully')
  } else {
    await db
      .insert(commentLikes)
      .values({
        commentId,
        userId
      })

    return ApiResponse.success(res, { liked: true }, 'Comment liked successfully')
  }
}))

export default router

