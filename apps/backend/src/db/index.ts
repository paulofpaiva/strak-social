import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as authSchema from '../schemas/auth';
import * as postsSchema from '../schemas/posts';
import * as commentsSchema from '../schemas/comments';
import * as likesSchema from '../schemas/likes';
import * as commentLikesSchema from '../schemas/commentLikes';

const schema = {
  ...authSchema,
  ...postsSchema,
  ...commentsSchema,
  ...likesSchema,
  ...commentLikesSchema,
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
