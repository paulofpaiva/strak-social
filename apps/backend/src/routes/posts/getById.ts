import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { comments } from '../../schemas/comments'
import { authenticateToken } from '../../middleware/auth'
import { eq, asc, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id

  const postWithUser = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      }
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, postId))
    .limit(1)

  if (postWithUser.length === 0) {
    throw new AppError('Post not found', 404)
  }

  const post = postWithUser[0]

  const media = await db
    .select({
      id: postMedia.id,
      mediaUrl: postMedia.mediaUrl,
      mediaType: postMedia.mediaType,
      order: postMedia.order,
    })
    .from(postMedia)
    .where(eq(postMedia.postId, post.id))
    .orderBy(asc(postMedia.order))

  const likesCount = await db
    .select({ count: likes.id })
    .from(likes)
    .where(eq(likes.postId, post.id))

  const userLiked = await db
    .select({ id: likes.id })
    .from(likes)
    .where(and(eq(likes.postId, post.id), eq(likes.userId, req.user!.id)))
    .limit(1)

  const commentsCount = await db
    .select({ count: comments.id })
    .from(comments)
    .where(eq(comments.postId, post.id))

  const postWithDetails = {
    ...post,
    media,
    likesCount: likesCount.length,
    userLiked: userLiked.length > 0,
    commentsCount: commentsCount.length,
  }

  return ApiResponse.success(res, postWithDetails, 'Post retrieved successfully')
}))

export default router

