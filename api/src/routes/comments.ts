import { Router } from 'express';
import { db } from '../db/index.js';
import { comments, createCommentSchema, updateCommentSchema } from '../schemas/comments.js';
import { commentsMedia } from '../schemas/commentsMedia.js';
import { commentLikes } from '../schemas/commentLikes.js';
import { users } from '../schemas/auth.js';
import { posts } from '../schemas/posts.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, desc, asc, and, isNull } from 'drizzle-orm';

const router = Router();

router.post('/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const validatedData = createCommentSchema.parse(req.body);

    const postExists = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (postExists.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = await db
      .insert(comments)
      .values({
        postId,
        userId: req.user!.id,
        content: validatedData.content,
        parentCommentId: validatedData.parentCommentId || null,
      })
      .returning({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        parentCommentId: comments.parentCommentId,
        content: comments.content,
        createdAt: comments.createdAt,
      });

    let mediaData: any[] = [];
    if (validatedData.media && validatedData.media.length > 0) {
      const mediaToInsert = validatedData.media.map(media => ({
        commentId: newComment[0].id,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        order: media.order,
      }));

      mediaData = await db
        .insert(commentsMedia)
        .values(mediaToInsert)
        .returning({
          id: commentsMedia.id,
          commentId: commentsMedia.commentId,
          mediaUrl: commentsMedia.mediaUrl,
          mediaType: commentsMedia.mediaType,
          order: commentsMedia.order,
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

    const commentWithUser = {
      ...newComment[0],
      user: userData[0],
      media: mediaData,
    };

    res.status(201).json({
      message: 'Comment created successfully',
      comment: commentWithUser
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/comment/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    const commentWithUser = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        parentCommentId: comments.parentCommentId,
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
      .where(eq(comments.id, commentId))
      .limit(1);

    if (commentWithUser.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = commentWithUser[0];

    const media = await db
      .select({
        id: commentsMedia.id,
        mediaUrl: commentsMedia.mediaUrl,
        mediaType: commentsMedia.mediaType,
        order: commentsMedia.order,
      })
      .from(commentsMedia)
      .where(eq(commentsMedia.commentId, comment.id))
      .orderBy(asc(commentsMedia.order));

    const likesCount = await db
      .select({ count: commentLikes.id })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, comment.id));

    const userLiked = await db
      .select({ id: commentLikes.id })
      .from(commentLikes)
      .where(and(eq(commentLikes.commentId, comment.id), eq(commentLikes.userId, req.user!.id)))
      .limit(1);

    const repliesCount = await db
      .select({ count: comments.id })
      .from(comments)
      .where(eq(comments.parentCommentId, comment.id));

    const commentWithDetails = {
      ...comment,
      media,
      likesCount: likesCount.length,
      userLiked: userLiked.length > 0,
      repliesCount: repliesCount.length,
    };

    res.json({
      message: 'Comment retrieved successfully',
      comment: commentWithDetails
    });

  } catch (error) {
    console.error('Get comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/post/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
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
        parentCommentId: comments.parentCommentId,
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
      .where(and(eq(comments.postId, postId), isNull(comments.parentCommentId)))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const commentsWithMedia = await Promise.all(
      commentsWithUsers.map(async (comment) => {
        const media = await db
          .select({
            id: commentsMedia.id,
            mediaUrl: commentsMedia.mediaUrl,
            mediaType: commentsMedia.mediaType,
            order: commentsMedia.order,
          })
          .from(commentsMedia)
          .where(eq(commentsMedia.commentId, comment.id))
          .orderBy(asc(commentsMedia.order));

        const likesCount = await db
          .select({ count: commentLikes.id })
          .from(commentLikes)
          .where(eq(commentLikes.commentId, comment.id));

        const userLiked = await db
          .select({ id: commentLikes.id })
          .from(commentLikes)
          .where(and(eq(commentLikes.commentId, comment.id), eq(commentLikes.userId, req.user!.id)))
          .limit(1);

        const repliesCount = await db
          .select({ count: comments.id })
          .from(comments)
          .where(eq(comments.parentCommentId, comment.id));

        return {
          ...comment,
          media,
          likesCount: likesCount.length,
          userLiked: userLiked.length > 0,
          repliesCount: repliesCount.length,
        };
      })
    );

    res.json({
      message: 'Comments retrieved successfully',
      comments: commentsWithMedia,
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

router.put('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user!.id;
    const validatedData = updateCommentSchema.parse(req.body);

    const existingComment = await db
      .select({ id: comments.id, userId: comments.userId })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment[0].userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const updatedComment = await db
      .update(comments)
      .set({
        content: validatedData.content,
      })
      .where(eq(comments.id, commentId))
      .returning({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
      });

    await db
      .delete(commentsMedia)
      .where(eq(commentsMedia.commentId, commentId));

    let mediaData: any[] = [];
    if (validatedData.media && validatedData.media.length > 0) {
      const mediaToInsert = validatedData.media.map(media => ({
        commentId: commentId,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        order: media.order,
      }));

      mediaData = await db
        .insert(commentsMedia)
        .values(mediaToInsert)
        .returning({
          id: commentsMedia.id,
          commentId: commentsMedia.commentId,
          mediaUrl: commentsMedia.mediaUrl,
          mediaType: commentsMedia.mediaType,
          order: commentsMedia.order,
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

    const commentWithUser = {
      ...updatedComment[0],
      user: userData[0],
      media: mediaData,
    };

    res.json({
      message: 'Comment updated successfully',
      comment: commentWithUser
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user!.id;

    const existingComment = await db
      .select({ id: comments.id, userId: comments.userId })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment[0].userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await db
      .delete(comments)
      .where(eq(comments.id, commentId));

    res.json({
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:commentId/like', authenticateToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user!.id;

    const existingComment = await db
      .select({ id: comments.id })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const existingLike = await db
      .select({ id: commentLikes.id })
      .from(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(commentLikes)
        .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));

      res.json({
        message: 'Comment unliked successfully',
        liked: false
      });
    } else {
      await db
        .insert(commentLikes)
        .values({
          commentId,
          userId
        });

      res.json({
        message: 'Comment liked successfully',
        liked: true
      });
    }

  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/comment/:commentId/replies', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const commentExists = await db
      .select({ id: comments.id })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (commentExists.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const repliesWithUsers = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        parentCommentId: comments.parentCommentId,
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
      .where(eq(comments.parentCommentId, commentId))
      .orderBy(asc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const repliesWithMedia = await Promise.all(
      repliesWithUsers.map(async (reply) => {
        const media = await db
          .select({
            id: commentsMedia.id,
            mediaUrl: commentsMedia.mediaUrl,
            mediaType: commentsMedia.mediaType,
            order: commentsMedia.order,
          })
          .from(commentsMedia)
          .where(eq(commentsMedia.commentId, reply.id))
          .orderBy(asc(commentsMedia.order));

        const likesCount = await db
          .select({ count: commentLikes.id })
          .from(commentLikes)
          .where(eq(commentLikes.commentId, reply.id));

        const userLiked = await db
          .select({ id: commentLikes.id })
          .from(commentLikes)
          .where(and(eq(commentLikes.commentId, reply.id), eq(commentLikes.userId, req.user!.id)))
          .limit(1);

        return {
          ...reply,
          media,
          likesCount: likesCount.length,
          userLiked: userLiked.length > 0,
        };
      })
    );

    res.json({
      message: 'Replies retrieved successfully',
      replies: repliesWithMedia,
      pagination: {
        page,
        limit,
        hasMore: repliesWithUsers.length === limit
      }
    });

  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as commentsRoutes };
