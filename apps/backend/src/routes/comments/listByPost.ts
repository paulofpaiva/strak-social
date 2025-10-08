import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { commentLikes } from '../../schemas/commentLikes'
import { users } from '../../schemas/auth'
import { posts } from '../../schemas/posts'
import { authenticateToken } from '../../middleware/auth'
import { eq, desc, asc, and, isNull } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/post/:postId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 3
  const offset = (page - 1) * limit

  const postExists = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (postExists.length === 0) {
    throw new AppError('Post not found', 404)
  }

  const commentsWithUsers = await db
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
        isVerified: users.isVerified,
      }
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.postId, postId), isNull(comments.parentCommentId)))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset)

  const commentsWithMedia = await Promise.all(
    commentsWithUsers.map(async (comment: typeof commentsWithUsers[0]) => {
      const media = await db
        .select({
          id: commentsMedia.id,
          mediaUrl: commentsMedia.mediaUrl,
          mediaType: commentsMedia.mediaType,
          order: commentsMedia.order,
        })
        .from(commentsMedia)
        .where(eq(commentsMedia.commentId, comment.id))
        .orderBy(asc(commentsMedia.order))

      const likesCount = await db
        .select({ count: commentLikes.id })
        .from(commentLikes)
        .where(eq(commentLikes.commentId, comment.id))

      const userLiked = await db
        .select({ id: commentLikes.id })
        .from(commentLikes)
        .where(and(eq(commentLikes.commentId, comment.id), eq(commentLikes.userId, req.user!.id)))
        .limit(1)

      const repliesCount = await db
        .select({ count: comments.id })
        .from(comments)
        .where(eq(comments.parentCommentId, comment.id))

      return {
        ...comment,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
        repliesCount: repliesCount.length,
      }
    })
  )

  return ApiResponse.success(res, {
    comments: commentsWithMedia,
    pagination: {
      page,
      limit,
      hasMore: commentsWithUsers.length === limit
    }
  }, 'Comments retrieved successfully')
}))

export default router

