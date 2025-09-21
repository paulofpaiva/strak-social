import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../schemas/auth.js';
import { signUpSchema, signInSchema } from '../schemas/auth.js';
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
        error: 'Este email já está cadastrado. Tente fazer login ou use outro email.' 
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
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: newUser[0]
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
    }
    
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/sign-in', async (req, res) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    
    // Buscar usuário
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        password: users.password,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = userResult[0];

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Definir cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
    }
    
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logout
router.post('/sign-out', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logout realizado com sucesso' });
});

// Verificar sessão atual
router.get('/session', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Rota protegida de exemplo
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Perfil do usuário',
    user: req.user 
  });
});

export { router as authRoutes };
