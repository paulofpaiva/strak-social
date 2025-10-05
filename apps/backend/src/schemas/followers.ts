import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const followers = pgTable('followers', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('follower_id').notNull(),
  followingId: uuid('following_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
