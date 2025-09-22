import { Router } from 'express';
import { db } from '../db/index.js';
import { users } from '../schemas/auth.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, ilike, or, and, ne } from 'drizzle-orm';

const router = Router();

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    const currentUserId = req.user!.id;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.json({
        message: 'Search query is required',
        users: []
      });
    }

    const searchTerm = `%${query.trim()}%`;

    const searchResults = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        and(
          ne(users.id, currentUserId),
          or(
            ilike(users.name, searchTerm),
            ilike(users.username, searchTerm)
          )
        )
      )
      .limit(parseInt(limit as string));

    res.json({
      message: 'Users found successfully',
      users: searchResults
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as searchRoutes };
