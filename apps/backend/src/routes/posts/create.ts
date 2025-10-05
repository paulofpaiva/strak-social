import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { createPostSchema } from '../../schemas/posts'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createPostSchema.parse(req.body)
  
  const newPost = await db
    .insert(posts)
    .values({
      userId: req.user!.id,
      content: validatedData.content,
    })
    .returning({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })

  let mediaData: any[] = []
  if (validatedData.media && validatedData.media.length > 0) {
    const mediaToInsert = validatedData.media.map(media => ({
      postId: newPost[0].id,
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
    .where(eq(users.id, req.user!.id))
    .limit(1)

  const postWithUser = {
    ...newPost[0],
    user: userData[0],
    media: mediaData,
  }

  return ApiResponse.created(res, postWithUser, 'Post created successfully')
}))

export default router

