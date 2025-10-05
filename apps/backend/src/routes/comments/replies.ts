import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { commentLikes } from '../../schemas/commentLikes'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, asc, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/comment/:commentId/replies', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const commentExists = await db
    .select({ id: comments.id })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (commentExists.length === 0) {
    throw new AppError('Comment not found', 404)
  }

  const repliesWithUsers = await db
    .select({
      id: comments.id,
      postId: comments.postId,
      userId: comments.userId,
      parentCommentId: comments.parentCommentId,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      }
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.parentCommentId, commentId))
    .orderBy(asc(comments.createdAt))
    .limit(limit)
    .offset(offset)

  const repliesWithMedia = await Promise.all(
    repliesWithUsers.map(async (reply: typeof repliesWithUsers[0]) => {
      const media = await db
        .select({
          id: commentsMedia.id,
          mediaUrl: commentsMedia.mediaUrl,
          mediaType: commentsMedia.mediaType,
          order: commentsMedia.order,
        })
        .from(commentsMedia)
        .where(eq(commentsMedia.commentId, reply.id))
        .orderBy(asc(commentsMedia.order))

      const likesCount = await db
        .select({ count: commentLikes.id })
        .from(commentLikes)
        .where(eq(commentLikes.commentId, reply.id))

      const userLiked = await db
        .select({ id: commentLikes.id })
        .from(commentLikes)
        .where(and(eq(commentLikes.commentId, reply.id), eq(commentLikes.userId, req.user!.id)))
        .limit(1)

      return {
        ...reply,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
      }
    })
  )

  return ApiResponse.success(res, {
    replies: repliesWithMedia,
    pagination: {
      page,
      limit,
      hasMore: repliesWithUsers.length === limit
    }
  }, 'Replies retrieved successfully')
}))

export default router

