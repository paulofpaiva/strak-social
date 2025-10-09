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

router.get('/trending', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit
  const userId = req.user!.id

  // Get posts with their users
  const postsWithUsers = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        isVerified: users.isVerified,
      }
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit * 3) // Fetch more to ensure enough after sorting

  const postsWithEngagement = await Promise.all(
    postsWithUsers.map(async (post) => {
      const media = await db
        .select({
          id: postMedia.id,
          postId: postMedia.postId,
          mediaUrl: postMedia.mediaUrl,
          mediaType: postMedia.mediaType,
          order: postMedia.order,
        })
        .from(postMedia)
        .where(eq(postMedia.postId, post.id))
        .orderBy(asc(postMedia.order))

      const likesCount = await db
        .select({ count: likes.id })
        .from(likes)
        .where(eq(likes.postId, post.id))

      const userLiked = await db
        .select({ id: likes.id })
        .from(likes)
        .where(and(eq(likes.postId, post.id), eq(likes.userId, userId)))
        .limit(1)

      const commentsCount = await db
        .select({ count: comments.id })
        .from(comments)
        .where(eq(comments.postId, post.id))

      const userBookmarked = await db
        .select({ id: bookmarks.id })
        .from(bookmarks)
        .where(and(eq(bookmarks.postId, post.id), eq(bookmarks.userId, userId)))
        .limit(1)

      const bookmarksCount = await db
        .select({ count: bookmarks.id })
        .from(bookmarks)
        .where(eq(bookmarks.postId, post.id))

      const engagement = likesCount.length + commentsCount.length + bookmarksCount.length

      return {
        ...post,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
        userBookmarked: userBookmarked.length > 0,
        bookmarksCount: bookmarksCount.length,
        commentsCount: commentsCount.length,
        engagement,
      }
    })
  )

  // Sort by engagement
  const sortedPosts = postsWithEngagement
    .sort((a, b) => b.engagement - a.engagement)
    .slice(offset, offset + limit)
    .map(({ engagement, ...post }) => post)

  return ApiResponse.success(res, {
    posts: sortedPosts,
    pagination: {
      page,
      limit,
      hasMore: postsWithEngagement.length > offset + limit
    }
  }, 'Trending posts retrieved successfully')
}))

export default router

