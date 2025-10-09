import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { comments } from '../../schemas/comments'
import { bookmarks } from '../../schemas/bookmarks'
import { authenticateToken } from '../../middleware/auth'
import { eq, desc, asc, and } from 'drizzle-orm'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.get('/bookmarks', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const userBookmarks = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      bookmarkCreatedAt: bookmarks.createdAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        isVerified: users.isVerified,
      }
    })
    .from(bookmarks)
    .innerJoin(posts, eq(bookmarks.postId, posts.id))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit)
    .offset(offset)

  const postsWithMedia = await Promise.all(
    userBookmarks.map(async (bookmark) => {
      const media = await db
        .select({
          id: postMedia.id,
          postId: postMedia.postId,
          mediaUrl: postMedia.mediaUrl,
          mediaType: postMedia.mediaType,
          order: postMedia.order,
        })
        .from(postMedia)
        .where(eq(postMedia.postId, bookmark.id))
        .orderBy(asc(postMedia.order))

      const likesCount = await db
        .select({ count: likes.id })
        .from(likes)
        .where(eq(likes.postId, bookmark.id))

      const userLiked = await db
        .select({ id: likes.id })
        .from(likes)
        .where(and(eq(likes.postId, bookmark.id), eq(likes.userId, userId)))
        .limit(1)

      const commentsCount = await db
        .select({ count: comments.id })
        .from(comments)
        .where(eq(comments.postId, bookmark.id))

      const bookmarksCount = await db
        .select({ count: bookmarks.id })
        .from(bookmarks)
        .where(eq(bookmarks.postId, bookmark.id))

      return {
        id: bookmark.id,
        userId: bookmark.userId,
        content: bookmark.content,
        createdAt: bookmark.createdAt,
        updatedAt: bookmark.updatedAt,
        user: bookmark.user,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
        userBookmarked: true,
        bookmarksCount: bookmarksCount.length,
        commentsCount: commentsCount.length,
      }
    })
  )

  return ApiResponse.success(res, {
    posts: postsWithMedia,
    pagination: {
      page,
      limit,
      hasMore: userBookmarks.length === limit
    }
  }, 'Bookmarks retrieved successfully')
}))

export default router

