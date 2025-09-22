import { Router } from 'express';
import { db } from '../db/index.js';
import { posts } from '../schemas/posts.js';
import { postMedia } from '../schemas/postMedia.js';
import { users } from '../schemas/auth.js';
import { likes } from '../schemas/likes.js';
import { comments } from '../schemas/comments.js';
import { createPostSchema } from '../schemas/posts.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, desc, asc, and } from 'drizzle-orm';

const router = Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    
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
      });

    let mediaData: any[] = [];
    if (validatedData.media && validatedData.media.length > 0) {
      const mediaToInsert = validatedData.media.map(media => ({
        postId: newPost[0].id,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        order: media.order,
      }));

      mediaData = await db
        .insert(postMedia)
        .values(mediaToInsert)
        .returning({
          id: postMedia.id,
          postId: postMedia.postId,
          mediaUrl: postMedia.mediaUrl,
          mediaType: postMedia.mediaType,
          order: postMedia.order,
        });
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
      .limit(1);

    const postWithUser = {
      ...newPost[0],
      user: userData[0],
      media: mediaData,
    };

    res.status(201).json({
      message: 'Post created successfully',
      post: postWithUser
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

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
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithMedia = await Promise.all(
      postsWithUsers.map(async (post) => {
        const media = await db
          .select({
            id: postMedia.id,
            mediaUrl: postMedia.mediaUrl,
            mediaType: postMedia.mediaType,
            order: postMedia.order,
          })
          .from(postMedia)
          .where(eq(postMedia.postId, post.id))
          .orderBy(asc(postMedia.order));

        const likesCount = await db
          .select({ count: likes.id })
          .from(likes)
          .where(eq(likes.postId, post.id));

        const userLiked = await db
          .select({ id: likes.id })
          .from(likes)
          .where(and(eq(likes.postId, post.id), eq(likes.userId, req.user!.id)))
          .limit(1);

        return {
          ...post,
          media,
          likesCount: likesCount.length,
          userLiked: userLiked.length > 0,
        };
      })
    );

    res.json({
      message: 'Posts retrieved successfully',
      posts: postsWithMedia,
      pagination: {
        page,
        limit,
        hasMore: postsWithUsers.length === limit
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

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
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithMedia = await Promise.all(
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
          .orderBy(asc(postMedia.order));

        const likesCount = await db
          .select({ count: likes.id })
          .from(likes)
          .where(eq(likes.postId, post.id));

        const userLiked = await db
          .select({ id: likes.id })
          .from(likes)
          .where(and(eq(likes.postId, post.id), eq(likes.userId, req.user!.id)))
          .limit(1);

        const commentsCount = await db
          .select({ count: comments.id })
          .from(comments)
          .where(eq(comments.postId, post.id));

        return {
          ...post,
          media,
          likesCount: likesCount.length,
          userLiked: userLiked.length > 0,
          commentsCount: commentsCount.length,
        };
      })
    );

    res.json({
      message: 'User posts retrieved successfully',
      posts: postsWithMedia,
      pagination: {
        page,
        limit,
        hasMore: postsWithUsers.length === limit
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    const existingPost = await db
      .select({ id: posts.id, userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost[0].userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await db
      .delete(posts)
      .where(eq(posts.id, postId));

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;
    const validatedData = createPostSchema.parse(req.body);

    const existingPost = await db
      .select({ id: posts.id, userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost[0].userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const updatedPost = await db
      .update(posts)
      .set({
        content: validatedData.content,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId))
      .returning({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      });

    await db
      .delete(postMedia)
      .where(eq(postMedia.postId, postId));

    let mediaData: any[] = [];
    if (validatedData.media && validatedData.media.length > 0) {
      const mediaToInsert = validatedData.media.map(media => ({
        postId: postId,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        order: media.order,
      }));

      mediaData = await db
        .insert(postMedia)
        .values(mediaToInsert)
        .returning({
          id: postMedia.id,
          postId: postMedia.postId,
          mediaUrl: postMedia.mediaUrl,
          mediaType: postMedia.mediaType,
          order: postMedia.order,
        });
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
      .limit(1);

    const likesCount = await db
      .select({ count: likes.id })
      .from(likes)
      .where(eq(likes.postId, postId));

    const userLiked = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    const postWithUser = {
      ...updatedPost[0],
      user: userData[0],
      media: mediaData,
      likesCount: likesCount.length,
      userLiked: userLiked.length > 0,
    };

    res.json({
      message: 'Post updated successfully',
      post: postWithUser
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    const postWithUser = await db
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
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (postWithUser.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postWithUser[0];

    const media = await db
      .select({
        id: postMedia.id,
        mediaUrl: postMedia.mediaUrl,
        mediaType: postMedia.mediaType,
        order: postMedia.order,
      })
      .from(postMedia)
      .where(eq(postMedia.postId, post.id))
      .orderBy(asc(postMedia.order));

    const likesCount = await db
      .select({ count: likes.id })
      .from(likes)
      .where(eq(likes.postId, post.id));

    const userLiked = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.postId, post.id), eq(likes.userId, req.user!.id)))
      .limit(1);

    const commentsCount = await db
      .select({ count: comments.id })
      .from(comments)
      .where(eq(comments.postId, post.id));

    const postWithDetails = {
      ...post,
      media,
      likesCount: likesCount.length,
      userLiked: userLiked.length > 0,
      commentsCount: commentsCount.length,
    };

    res.json({
      message: 'Post retrieved successfully',
      post: postWithDetails
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = (page - 1) * limit;

    const postExists = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (postExists.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentsWithUsers = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      message: 'Comments retrieved successfully',
      comments: commentsWithUsers,
      pagination: {
        page,
        limit,
        hasMore: commentsWithUsers.length === limit
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

      res.json({
        message: 'Post unliked successfully',
        liked: false
      });
    } else {
      await db
        .insert(likes)
        .values({
          postId,
          userId
        });

      res.json({
        message: 'Post liked successfully',
        liked: true
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as postsRoutes };
