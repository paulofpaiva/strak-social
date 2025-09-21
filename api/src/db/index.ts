import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as authSchema from '../schemas/auth.js';
import * as postsSchema from '../schemas/posts.js';
import * as commentsSchema from '../schemas/comments.js';
import * as likesSchema from '../schemas/likes.js';

const schema = {
  ...authSchema,
  ...postsSchema,
  ...commentsSchema,
  ...likesSchema,
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
