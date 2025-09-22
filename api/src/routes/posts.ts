import { Router } from 'express';
import { db } from '../db/index.js';
import { posts } from '../schemas/posts.js';
import { postMedia } from '../schemas/postMedia.js';
import { users } from '../schemas/auth.js';
import { createPostSchema } from '../schemas/posts.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, desc, asc } from 'drizzle-orm';

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
            postId: postMedia.postId,
            mediaUrl: postMedia.mediaUrl,
            mediaType: postMedia.mediaType,
            order: postMedia.order,
          })
          .from(postMedia)
          .where(eq(postMedia.postId, post.id))
          .orderBy(asc(postMedia.order));

        return {
          ...post,
          media,
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

        return {
          ...post,
          media,
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

export { router as postsRoutes };
