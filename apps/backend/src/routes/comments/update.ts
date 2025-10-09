import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { comments } from '../../schemas/comments'
import { commentsMedia } from '../../schemas/commentsMedia'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq, inArray, asc } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { mediaUpload } from '../upload/config'
import { uploadPostMediaFiles, deletePostMediaFiles } from '../../services/postMedia'

const router = Router()

router.put('/:commentId', 
  authenticateToken,
  mediaUpload.array('media', 4),
  asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params
  const userId = req.user!.id
  const { content, mediaOrder } = req.body
  
  if (!content || content.length < 1 || content.length > 280) {
    throw new AppError('Content must be between 1 and 280 characters', 400)
  }

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

  const parsedMediaOrder: Array<{ id: string; isExisting: boolean }> = mediaOrder ? JSON.parse(mediaOrder) : []
  
  const existingMediaInOrder = parsedMediaOrder.filter(m => m.isExisting)
  const mediaIdsToKeep = existingMediaInOrder.map(m => m.id)

  const currentMedia = await db
    .select()
    .from(commentsMedia)
    .where(eq(commentsMedia.commentId, commentId))

  const mediaToDelete = currentMedia.filter(m => !mediaIdsToKeep.includes(m.id))

  if (mediaToDelete.length > 0) {
    await db
      .delete(commentsMedia)
      .where(inArray(commentsMedia.id, mediaToDelete.map(m => m.id)))
    
    const urlsToDelete = mediaToDelete.map(m => m.mediaUrl)
    await deletePostMediaFiles(urlsToDelete)
  }

  const existingMediaOrderMap = new Map<string, number>()
  parsedMediaOrder.forEach((m, index) => {
    if (m.isExisting) {
      existingMediaOrderMap.set(m.id, index)
    }
  })

  if (existingMediaOrderMap.size > 0) {
    for (const [mediaId, order] of existingMediaOrderMap.entries()) {
      await db
        .update(commentsMedia)
        .set({ order })
        .where(eq(commentsMedia.id, mediaId))
    }
  }

  const updatedComment = await db
    .update(comments)
    .set({
      content,
    })
    .where(eq(comments.id, commentId))
    .returning({
      id: comments.id,
      postId: comments.postId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
    })

  let uploadedMedia: any[] = []
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    try {
      uploadedMedia = await uploadPostMediaFiles(req.files)
    } catch (error) {
      throw new AppError('Failed to upload media files', 500)
    }
  }

  let newMediaData: any[] = []
  if (uploadedMedia.length > 0) {
    const newMediaPositions: number[] = []
    parsedMediaOrder.forEach((m, index) => {
      if (!m.isExisting) {
        newMediaPositions.push(index)
      }
    })

    const mediaToInsert = uploadedMedia.map((media, index) => ({
      commentId: commentId,
      mediaUrl: media.url,
      mediaType: media.type,
      order: newMediaPositions[index] || 0,
    }))

    newMediaData = await db
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

  const allMedia = await db
    .select({
      id: commentsMedia.id,
      commentId: commentsMedia.commentId,
      mediaUrl: commentsMedia.mediaUrl,
      mediaType: commentsMedia.mediaType,
      order: commentsMedia.order,
    })
    .from(commentsMedia)
    .where(eq(commentsMedia.commentId, commentId))
    .orderBy(asc(commentsMedia.order))

  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatar: users.avatar,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const commentWithUser = {
    ...updatedComment[0],
    user: userData[0],
    media: allMedia,
  }

  return ApiResponse.success(res, commentWithUser, 'Comment updated successfully')
})
)

export default router

