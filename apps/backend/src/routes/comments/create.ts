import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { users } from '../../schemas/auth'
import { posts } from '../../schemas/posts'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { createCommentLimiter } from '../../middleware/rateLimiter'
import { mediaUpload } from '../upload/config'
import { uploadPostMediaFiles } from '../../services/postMedia'

const router = Router()

router.post('/:postId', 
  authenticateToken, 
  createCommentLimiter,
  mediaUpload.array('media', 4),
  asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params
  const { content, parentCommentId } = req.body
  
  if (!content || content.length < 1 || content.length > 280) {
    throw new AppError('Content must be between 1 and 280 characters', 400)
  }

  const postExists = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (postExists.length === 0) {
    throw new AppError('Post not found', 404)
  }

  let uploadedMedia: any[] = []
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    try {
      const mediaResults = await uploadPostMediaFiles(req.files)
      uploadedMedia = mediaResults
    } catch (error) {
      throw new AppError('Failed to upload media files', 500)
    }
  }

  const newComment = await db
    .insert(comments)
    .values({
      postId,
      userId: req.user!.id,
      content,
      parentCommentId: parentCommentId || null,
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
  if (uploadedMedia.length > 0) {
    const mediaToInsert = uploadedMedia.map(media => ({
      commentId: newComment[0].id,
      mediaUrl: media.url,
      mediaType: media.type,
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
      isVerified: users.isVerified,
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
})
)

export default router

