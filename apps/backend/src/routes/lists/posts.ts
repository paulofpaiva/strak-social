import { Router, Request, Response } from 'express'
import { db } from '../../db/index'
import { lists } from '../../schemas/lists'
import { listPosts } from '../../schemas/listPosts'
import { posts } from '../../schemas/posts'
import { postMedia } from '../../schemas/postMedia'
import { users } from '../../schemas/auth'
import { likes } from '../../schemas/likes'
import { comments } from '../../schemas/comments'
import { bookmarks } from '../../schemas/bookmarks'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { eq, and, inArray, desc, asc, isNull } from 'drizzle-orm'

const router = Router()

router.get('/posts/:postId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const postId = req.params.postId

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (post.length === 0) {
    throw new AppError('Post not found', 404)
  }

  const userListsWithPost = await db
    .select({
      listId: listPosts.listId
    })
    .from(listPosts)
    .innerJoin(lists, eq(listPosts.listId, lists.id))
    .where(
      and(
        eq(lists.userId, userId),
        eq(listPosts.postId, postId)
      )
    )

  const listIds = userListsWithPost.map(item => item.listId)

  return ApiResponse.success(res, { listIds }, 'Post lists retrieved successfully')
}))

router.put('/posts/:postId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const postId = req.params.postId
  const { listIds } = req.body

  if (!Array.isArray(listIds)) {
    throw new AppError('listIds must be an array', 400)
  }

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (post.length === 0) {
    throw new AppError('Post not found', 404)
  }

  if (listIds.length > 0) {
    const userLists = await db
      .select({ id: lists.id })
      .from(lists)
      .where(
        and(
          eq(lists.userId, userId),
          inArray(lists.id, listIds)
        )
      )

    const userListIds = userLists.map(list => list.id)
    const invalidListIds = listIds.filter(id => !userListIds.includes(id))

    if (invalidListIds.length > 0) {
      throw new AppError('You do not have permission to modify some of these lists', 403)
    }
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(listPosts)
      .where(
        and(
          eq(listPosts.postId, postId),
          inArray(
            listPosts.listId,
            await tx
              .select({ id: lists.id })
              .from(lists)
              .where(eq(lists.userId, userId))
              .then(rows => rows.map(row => row.id))
          )
        )
      )

    if (listIds.length > 0) {
      const newRelations = listIds.map(listId => ({
        listId,
        postId,
        addedBy: userId
      }))

      await tx.insert(listPosts).values(newRelations)
    }
  })

  return ApiResponse.success(res, { listIds }, 'Post lists updated successfully')
}))

router.get('/:id/posts', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.id
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const offset = (page - 1) * limit

  const list = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (list.length === 0) {
    throw new AppError('List not found', 404)
  }

  const listData = list[0]
  const isOwner = listData.userId === userId

  if (listData.isPrivate && !isOwner) {
    throw new AppError('You do not have permission to view this list', 403)
  }

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
    .innerJoin(listPosts, eq(posts.id, listPosts.postId))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(listPosts.listId, listId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  const postsWithMedia = await Promise.all(
    postsWithUsers.map(async (post: typeof postsWithUsers[0]) => {
      const media = await db
        .select({
          id: postMedia.id,
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
        .where(and(
          eq(comments.postId, post.id),
          isNull(comments.parentCommentId)
        ))

      const userBookmarked = await db
        .select({ id: bookmarks.id })
        .from(bookmarks)
        .where(and(eq(bookmarks.postId, post.id), eq(bookmarks.userId, userId)))
        .limit(1)

      const bookmarksCount = await db
        .select({ count: bookmarks.id })
        .from(bookmarks)
        .where(eq(bookmarks.postId, post.id))

      return {
        ...post,
        media,
        likesCount: likesCount.length,
        userLiked: userLiked.length > 0,
        userBookmarked: userBookmarked.length > 0,
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
      hasMore: postsWithUsers.length === limit
    }
  }, 'List posts retrieved successfully')
}))

router.delete('/:listId/posts/:postId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const listId = req.params.listId
  const postId = req.params.postId

  const list = await db
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1)

  if (list.length === 0) {
    throw new AppError('List not found', 404)
  }

  if (list[0].userId !== userId) {
    throw new AppError('You do not have permission to remove posts from this list', 403)
  }

  const listPost = await db
    .select()
    .from(listPosts)
    .where(and(eq(listPosts.listId, listId), eq(listPosts.postId, postId)))
    .limit(1)

  if (listPost.length === 0) {
    throw new AppError('Post not found in this list', 404)
  }

  await db
    .delete(listPosts)
    .where(and(eq(listPosts.listId, listId), eq(listPosts.postId, postId)))

  return ApiResponse.success(res, null, 'Post removed from list successfully')
}))

export default router
