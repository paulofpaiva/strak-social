import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { authenticateToken } from '../../middleware/auth'
import { eq, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { mediaUpload } from '../upload/config'
import { uploadPostMediaFiles, deletePostMediaFiles } from '../../services/postMedia'

const router = Router()

router.put('/:id', 
  authenticateToken,
  mediaUpload.array('media', 3),
  asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.id
    const userId = req.user!.id
    const { content } = req.body
    
    if (!content || content.length < 1 || content.length > 280) {
      throw new AppError('Content must be between 1 and 280 characters', 400)
    }

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

    const oldMedia = await db
      .select({ mediaUrl: postMedia.mediaUrl })
      .from(postMedia)
      .where(eq(postMedia.postId, postId))

    const updatedPost = await db
      .update(posts)
      .set({
        content,
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

    let uploadedMedia: any[] = []
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        uploadedMedia = await uploadPostMediaFiles(req.files)
      } catch (error) {
        throw new AppError('Failed to upload media files', 500)
      }
    }

    let mediaData: any[] = []
    if (uploadedMedia.length > 0) {
      const mediaToInsert = uploadedMedia.map(media => ({
        postId: postId,
        mediaUrl: media.url,
        mediaType: media.type,
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

    if (oldMedia.length > 0) {
      const oldMediaUrls = oldMedia.map(m => m.mediaUrl)
      await deletePostMediaFiles(oldMediaUrls)
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
  })
)

export default router

