import { Router } from 'express';
import { auth } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../schemas/auth.js';

const router = Router();

router.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    
    const result = await auth.api.signUpEmail({
      body: validatedData,
    });
    res.status(201).json({ 
      message: 'User created successfully',
      user: result.user 
    });
  } catch (error: any) {
    console.log(error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error'});
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    
    const result = await auth.api.signInEmail({
      body: validatedData,
    });

    if (result.token) {
      res.cookie('better-auth.session_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });
    }

    res.json({ 
      message: 'Login successful',
      user: result.user 
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid data',
        details: error.errors 
      });
    }
    
    if (error.message) {
      return res.status(401).json({ error: error.message });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sign-out', async (req, res) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No active session' });
    }

    await auth.api.signOut({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`,
      }),
    });

    res.clearCookie('better-auth.session_token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/session', async (req, res) => {
  try {
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No active session' });
    }

    const result = await auth.api.getSession({
      headers: new Headers({
        'cookie': `better-auth.session_token=${sessionToken}`,
      }),
    });

    res.json({ user: result.user });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRoutes };
