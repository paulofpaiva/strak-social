import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { authenticateToken } from '../../middleware/auth'
import { eq, desc, asc, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const postsWithUsers = await db
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
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  const postsWithMedia = await Promise.all(
    postsWithUsers.map(async (post: typeof postsWithUsers[0]) => {
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

      return {
        ...post,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
      }
    })
  )

  return ApiResponse.success(res, {
    posts: postsWithMedia,
    pagination: {
      page,
      limit,
      hasMore: postsWithUsers.length === limit
    }
  }, 'Posts retrieved successfully')
}))

export default router

