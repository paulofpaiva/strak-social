import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../schemas/auth.js';
import { signUpSchema, signInSchema, changePasswordSchema } from '../schemas/auth.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        error: 'This email is already registered. Try logging in or use another email.' 
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const newUser = await db
      .insert(users)
      .values({
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        avatar: validatedData.avatar,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (newUser[0].avatar && !newUser[0].avatar.startsWith('http')) {
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
      newUser[0].avatar = `${baseUrl}${newUser[0].avatar}`;
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
        name: users.name,
        password: users.password,
        avatar: users.avatar,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect email or password' });
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

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ 
    message: 'User profile',
    user: req.user 
  });
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    if (!name && !avatar) {
      return res.status(400).json({ 
        error: 'At least one field (name or avatar) must be provided' 
      });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    updateData.updatedAt = new Date();

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (updatedUser[0].avatar && !updatedUser[0].avatar.startsWith('http')) {
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
      updatedUser[0].avatar = `${baseUrl}${updatedUser[0].avatar}`;
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    
    // Get user with password
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

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, saltRounds);

    // Update password
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
