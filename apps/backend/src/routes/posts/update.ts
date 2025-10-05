import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { createPostSchema } from '../../schemas/posts'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id
  const userId = req.user!.id
  const validatedData = createPostSchema.parse(req.body)

  const existingPost = await db
    .select({ id: posts.id, userId: posts.userId })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (existingPost.length === 0) {
    throw new AppError('Post not found', 404)
  }

  if (existingPost[0].userId !== userId) {
    throw new AppError('You can only edit your own posts', 403)
  }

  const updatedPost = await db
    .update(posts)
    .set({
      content: validatedData.content,
      updatedAt: new Date()
    })
    .where(eq(posts.id, postId))
    .returning({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })

  await db
    .delete(postMedia)
    .where(eq(postMedia.postId, postId))

  let mediaData: any[] = []
  if (validatedData.media && validatedData.media.length > 0) {
    const mediaToInsert = validatedData.media.map(media => ({
      postId: postId,
      mediaUrl: media.mediaUrl,
      mediaType: media.mediaType,
      order: media.order,
    }))

    mediaData = await db
      .insert(postMedia)
      .values(mediaToInsert)
      .returning({
        id: postMedia.id,
        postId: postMedia.postId,
        mediaUrl: postMedia.mediaUrl,
        mediaType: postMedia.mediaType,
        order: postMedia.order,
      })
  }

  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const likesCount = await db
    .select({ count: likes.id })
    .from(likes)
    .where(eq(likes.postId, postId))

  const userLiked = await db
    .select({ id: likes.id })
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .limit(1)

  const postWithUser = {
    ...updatedPost[0],
    user: userData[0],
    media: mediaData,
    likesCount: likesCount.length,
    userLiked: userLiked.length > 0,
  }

  return ApiResponse.success(res, postWithUser, 'Post updated successfully')
}))

export default router

