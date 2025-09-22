import { Router } from 'express';
import { db } from '../db/index.js';
import { followers } from '../schemas/followers.js';
import { users } from '../schemas/auth.js';
import { followUserSchema, unfollowUserSchema } from '../schemas/follow.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

router.post('/follow', authenticateToken, async (req, res) => {
  try {
    const validatedData = followUserSchema.parse(req.body);
    const { userId } = validatedData;
    const currentUserId = req.user!.id;

    if (currentUserId === userId) {
      return res.status(400).json({ 
        error: 'You cannot follow yourself' 
      });
    }

    const targetUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (targetUser.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    const existingFollow = await db
      .select({ id: followers.id })
      .from(followers)
      .where(
        and(
          eq(followers.followerId, currentUserId),
          eq(followers.followingId, userId)
        )
      )
      .limit(1);

    if (existingFollow.length > 0) {
      return res.status(400).json({ 
        error: 'You are already following this user' 
      });
    }

    await db.insert(followers).values({
      followerId: currentUserId,
      followingId: userId,
    });

    res.json({
      message: 'User followed successfully'
    });

  } catch (error: any) {
    console.error('Follow user error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/unfollow', authenticateToken, async (req, res) => {
  try {
    const validatedData = unfollowUserSchema.parse(req.body);
    const { userId } = validatedData;
    const currentUserId = req.user!.id;

    if (currentUserId === userId) {
      return res.status(400).json({ 
        error: 'You cannot unfollow yourself' 
      });
    }

    const existingFollow = await db
      .select({ id: followers.id })
      .from(followers)
      .where(
        and(
          eq(followers.followerId, currentUserId),
          eq(followers.followingId, userId)
        )
      )
      .limit(1);

    if (existingFollow.length === 0) {
      return res.status(400).json({ 
        error: 'You are not following this user' 
      });
    }

    await db
      .delete(followers)
      .where(
        and(
          eq(followers.followerId, currentUserId),
          eq(followers.followingId, userId)
        )
      );

    res.json({
      message: 'User unfollowed successfully'
    });

  } catch (error: any) {
    console.error('Unfollow user error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user!.id;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    const isFollowing = await db
      .select({ id: followers.id })
      .from(followers)
      .where(
        and(
          eq(followers.followerId, currentUserId),
          eq(followers.followingId, userId)
        )
      )
      .limit(1);

    res.json({
      isFollowing: isFollowing.length > 0
    });

  } catch (error: any) {
    console.error('Check follow status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
