import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../schemas/auth.js';
import { followers } from '../schemas/followers.js';
import { signUpSchema, signInSchema, changePasswordSchema, checkUsernameSchema, updateProfileSchema } from '../schemas/auth.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { eq, or, sql } from 'drizzle-orm';

const router = Router();

router.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    
    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        error: 'This email is already registered. Try logging in or use another email.' 
      });
    }

    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, validatedData.username))
      .limit(1);

    if (existingUsername.length > 0) {
      return res.status(400).json({ 
        error: 'This username is already taken. Please choose another username.' 
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const newUser = await db
      .insert(users)
      .values({
        email: validatedData.email,
        username: validatedData.username,
        name: validatedData.name,
        password: hashedPassword,
        avatar: validatedData.avatar,
        cover: validatedData.cover,
        bio: validatedData.bio,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        birthDate: users.birthDate,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (newUser[0].avatar && !newUser[0].avatar.startsWith('http')) {
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
      newUser[0].avatar = `${baseUrl}${newUser[0].avatar}`;
    }

    if (newUser[0].cover && !newUser[0].cover.startsWith('http')) {
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
      newUser[0].cover = `${baseUrl}${newUser[0].cover}`;
    }

    const token = jwt.sign(
      { 
        userId: newUser[0].id, 
        email: newUser[0].email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        password: users.password,
        avatar: users.avatar,
        cover: users.cover,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(or(
        eq(users.email, validatedData.emailOrUsername),
        eq(users.username, validatedData.emailOrUsername)
      ))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Incorrect email/username or password' });
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect email/username or password' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ 
        available: false,
        message: 'Username is required' 
      });
    }
    
    const validation = checkUsernameSchema.safeParse({ username });
    if (!validation.success) {
      return res.status(400).json({ 
        available: false,
        message: 'Invalid username format' 
      });
    }
    
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return res.json({ 
        available: false,
        message: 'This username is already taken' 
      });
    }

    res.json({
      available: true,
      message: 'Username is available'
    });

  } catch (error: any) {
    console.error('Username check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sign-out', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logout successful' });
});

router.get('/session', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const followersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followingId, req.user!.id));

    const followingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followerId, req.user!.id));

    res.json({ 
      message: 'User profile',
      user: {
        ...req.user,
        followersCount: followersCount[0]?.count || 0,
        followingCount: followingCount[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const { name, bio, birthDate } = validatedData;
    
    if (!name && !bio && !birthDate) {
      return res.status(400).json({ 
        error: 'At least one field (name, bio, or birthDate) must be provided' 
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    updateData.updatedAt = new Date();

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        birthDate: users.birthDate,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ 
        error: 'Avatar URL is required' 
      });
    }

    const updatedUser = await db
      .update(users)
      .set({ avatar, updatedAt: new Date() })
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        birthDate: users.birthDate,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      message: 'Avatar updated successfully',
      user: updatedUser[0]
    });

  } catch (error: any) {
    console.error('Avatar update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cover', authenticateToken, async (req, res) => {
  try {
    const { cover } = req.body;
    
    if (!cover) {
      return res.status(400).json({ 
        error: 'Cover URL is required' 
      });
    }

    const updatedUser = await db
      .update(users)
      .set({ cover, updatedAt: new Date() })
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        cover: users.cover,
        bio: users.bio,
        birthDate: users.birthDate,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      message: 'Cover updated successfully',
      user: updatedUser[0]
    });

  } catch (error: any) {
    console.error('Cover update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    
    const userResult = await db
      .select({
        id: users.id,
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult[0];

    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, saltRounds);

    await db
      .update(users)
      .set({ 
        password: hashedNewPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user!.id));

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRoutes };
