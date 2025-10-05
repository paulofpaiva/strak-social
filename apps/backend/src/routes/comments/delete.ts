import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.delete('/:commentId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params
  const userId = req.user!.id

  const existingComment = await db
    .select({ id: comments.id, userId: comments.userId })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (existingComment.length === 0) {
    throw new AppError('Comment not found', 404)
  }

  if (existingComment[0].userId !== userId) {
    throw new AppError('You can only delete your own comments', 403)
  }

  await db
    .delete(comments)
    .where(eq(comments.parentCommentId, commentId))

  await db
    .delete(comments)
    .where(eq(comments.id, commentId))

  return ApiResponse.success(res, null, 'Comment deleted successfully')
}))

export default router

