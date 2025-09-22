import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgSchema } from 'drizzle-orm/pg-core';

export const strakSchema = pgSchema('strak_social');

export const followers = strakSchema.table('followers', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('follower_id').notNull(),
  followingId: uuid('following_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
