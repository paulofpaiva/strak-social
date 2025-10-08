import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { authenticateToken } from '../../middleware/auth'
import { eq } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { deletePostMediaFiles } from '../../services/postMedia'

const router = Router()

router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id
  const userId = req.user!.id

  const existingPost = await db
    .select({ id: posts.id, userId: posts.userId })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (existingPost.length === 0) {
    throw new AppError('Post not found', 404)
  }

  if (existingPost[0].userId !== userId) {
    throw new AppError('You can only delete your own posts', 403)
  }

  const media = await db
    .select({ mediaUrl: postMedia.mediaUrl })
    .from(postMedia)
    .where(eq(postMedia.postId, postId))

  await db
    .delete(posts)
    .where(eq(posts.id, postId))

  if (media.length > 0) {
    const mediaUrls = media.map(m => m.mediaUrl)
    await deletePostMediaFiles(mediaUrls)
  }

  return ApiResponse.success(res, null, 'Post deleted successfully')
}))

export default router

