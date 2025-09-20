import { Router } from 'express';
import { auth } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../schemas/auth.js';

const router = Router();

// Rota de registro
router.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    
    const result = await auth.api.signUpEmail({
      body: validatedData,
    });

    // O better-auth retorna sucesso ou lança erro, não tem propriedade error
    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      user: result.user 
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
    }
    
    // Tratar erros específicos do better-auth
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de login
router.post('/sign-in', async (req, res) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    
    const result = await auth.api.signInEmail({
      body: validatedData,
    });

    // Definir cookie de sessão
    if (result.token) {
      res.cookie('better-auth.session_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });
    }

    res.json({ 
      message: 'Login realizado com sucesso',
      user: result.user 
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
    }
    
    // Tratar erros específicos do better-auth
    if (error.message) {
      return res.status(401).json({ error: error.message });
    }
    
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de logout
router.post('/sign-out', async (req, res) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'Não há sessão ativa' });
    }

    await auth.api.signOut({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`,
      }),
    });

    res.clearCookie('better-auth.session_token');
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter sessão atual
router.get('/session', async (req, res) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'Não há sessão ativa' });
    }

    const result = await auth.api.getSession({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`,
      }),
    });

    res.json({ user: result.user });
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as authRoutes };
