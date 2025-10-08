import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { mediaUpload } from '../upload/config'
import { uploadPostMediaFiles } from '../../services/postMedia'

const router = Router()

router.post('/', 
  authenticateToken, 
  mediaUpload.array('media', 3),
  asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body
    
    if (!content || content.length < 1 || content.length > 280) {
      throw new AppError('Content must be between 1 and 280 characters', 400)
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
  
    const newPost = await db
      .insert(posts)
      .values({
        userId: req.user!.id,
        content,
      })
      .returning({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })

    let mediaData: any[] = []
    if (uploadedMedia.length > 0) {
      const mediaToInsert = uploadedMedia.map(media => ({
        postId: newPost[0].id,
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

    const postWithUser = {
      ...newPost[0],
      user: userData[0],
      media: mediaData,
    }

    return ApiResponse.created(res, postWithUser, 'Post created successfully')
  })
)

export default router

