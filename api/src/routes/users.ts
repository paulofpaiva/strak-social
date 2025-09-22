import { Router } from 'express';
import { db } from '../db/index.js';
import { users } from '../schemas/auth.js';
import { followers } from '../schemas/followers.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();

router.get('/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user[0];

    const followersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followingId, userData.id));

    const followingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followerId, userData.id));

    res.json({ 
      user: {
        ...userData,
        followersCount: followersCount[0]?.count || 0,
        followingCount: followingCount[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Get user by username error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
