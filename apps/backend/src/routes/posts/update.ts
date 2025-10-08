import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { authenticateToken } from '../../middleware/auth'
import { eq, and, inArray, asc } from 'drizzle-orm'
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
    const { content, mediaOrder } = req.body
    
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

    const parsedMediaOrder: Array<{ id: string; isExisting: boolean }> = mediaOrder ? JSON.parse(mediaOrder) : []
    
    const existingMediaInOrder = parsedMediaOrder.filter(m => m.isExisting)
    const mediaIdsToKeep = existingMediaInOrder.map(m => m.id)

    const currentMedia = await db
      .select()
      .from(postMedia)
      .where(eq(postMedia.postId, postId))

    const mediaToDelete = currentMedia.filter(m => !mediaIdsToKeep.includes(m.id))

    if (mediaToDelete.length > 0) {
      await db
        .delete(postMedia)
        .where(inArray(postMedia.id, mediaToDelete.map(m => m.id)))
      
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
          .update(postMedia)
          .set({ order })
          .where(eq(postMedia.id, mediaId))
      }
    }

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
      // Map new media to their positions in mediaOrder
      const newMediaPositions: number[] = []
      parsedMediaOrder.forEach((m, index) => {
        if (!m.isExisting) {
          newMediaPositions.push(index)
        }
      })

      const mediaToInsert = uploadedMedia.map((media, index) => ({
        postId: postId,
        mediaUrl: media.url,
        mediaType: media.type,
        order: newMediaPositions[index] || 0,
      }))

      newMediaData = await db
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

    const allMedia = await db
      .select({
        id: postMedia.id,
        postId: postMedia.postId,
        mediaUrl: postMedia.mediaUrl,
        mediaType: postMedia.mediaType,
        order: postMedia.order,
      })
      .from(postMedia)
      .where(eq(postMedia.postId, postId))
      .orderBy(asc(postMedia.order))

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
      media: allMedia,
      likesCount: likesCount.length,
      userLiked: userLiked.length > 0,
    }

    return ApiResponse.success(res, postWithUser, 'Post updated successfully')
  })
)

export default router

