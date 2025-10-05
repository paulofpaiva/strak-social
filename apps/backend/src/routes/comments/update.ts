import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments, updateCommentSchema } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.put('/:commentId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params
  const userId = req.user!.id
  const validatedData = updateCommentSchema.parse(req.body)

  const existingComment = await db
    .select({ id: comments.id, userId: comments.userId })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (existingComment.length === 0) {
    throw new AppError('Comment not found', 404)
  }

  if (existingComment[0].userId !== userId) {
    throw new AppError('You can only edit your own comments', 403)
  }

  const updatedComment = await db
    .update(comments)
    .set({
      content: validatedData.content,
    })
    .where(eq(comments.id, commentId))
    .returning({
      id: comments.id,
      postId: comments.postId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
    })

  await db
    .delete(commentsMedia)
    .where(eq(commentsMedia.commentId, commentId))

  let mediaData: any[] = []
  if (validatedData.media && validatedData.media.length > 0) {
    const mediaToInsert = validatedData.media.map(media => ({
      commentId: commentId,
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
    .where(eq(users.id, userId))
    .limit(1)

  const commentWithUser = {
    ...updatedComment[0],
    user: userData[0],
    media: mediaData,
  }

  return ApiResponse.success(res, commentWithUser, 'Comment updated successfully')
}))

export default router

