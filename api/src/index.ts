import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { auth } from './auth/config.js';
import { authRoutes } from './routes/auth.js';

// Carregar variáveis de ambiente
config({ path: './.env' });

// Debug: verificar se as variáveis estão sendo carregadas
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8000'
  ],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/auth', auth.handler);
app.use('/auth', authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const errorMessage = err.message || 'Something went wrong!';
  res.status(500).json({ error: errorMessage });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
