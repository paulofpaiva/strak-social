import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { comments } from '../../schemas/comments'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, desc } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/:id/comments', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id
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
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset)

  return ApiResponse.success(res, {
    comments: commentsWithUsers,
    pagination: {
      page,
      limit,
      hasMore: commentsWithUsers.length === limit
    }
  }, 'Comments retrieved successfully')
}))

export default router

