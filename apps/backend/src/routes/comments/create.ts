import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments, createCommentSchema } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { users } from '../../schemas/auth'
import { posts } from '../../schemas/posts'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/:postId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params
  const validatedData = createCommentSchema.parse(req.body)

  const postExists = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (postExists.length === 0) {
    throw new AppError('Post not found', 404)
  }

  const newComment = await db
    .insert(comments)
    .values({
      postId,
      userId: req.user!.id,
      content: validatedData.content,
      parentCommentId: validatedData.parentCommentId || null,
    })
    .returning({
      id: comments.id,
      postId: comments.postId,
      userId: comments.userId,
      parentCommentId: comments.parentCommentId,
      content: comments.content,
      createdAt: comments.createdAt,
    })

  let mediaData: any[] = []
  if (validatedData.media && validatedData.media.length > 0) {
    const mediaToInsert = validatedData.media.map(media => ({
      commentId: newComment[0].id,
      mediaUrl: media.mediaUrl,
      mediaType: media.mediaType,
      order: media.order,
    }))

    mediaData = await db
      .insert(commentsMedia)
      .values(mediaToInsert)
      .returning({
        id: commentsMedia.id,
        commentId: commentsMedia.commentId,
        mediaUrl: commentsMedia.mediaUrl,
        mediaType: commentsMedia.mediaType,
        order: commentsMedia.order,
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
    .where(eq(users.id, req.user!.id))
    .limit(1)

  const commentWithUser = {
    ...newComment[0],
    user: userData[0],
    media: mediaData,
  }

  return ApiResponse.created(res, commentWithUser, 'Comment created successfully')
}))

export default router

