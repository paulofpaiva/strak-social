import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { authRoutes } from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import { postsRoutes } from './routes/posts.js';
import { commentsRoutes } from './routes/comments.js';
import { searchRoutes } from './routes/search.js';
import followRoutes from './routes/follow.js';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8000'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});


app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/users', usersRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const errorMessage = err.message || 'Something went wrong!';
  res.status(500).json({ error: errorMessage });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
