import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./auth";

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    // user can only like once, could maybe think better of this sometime
  uniq: uniqueIndex("likes_user_post_idx").on(table.userId, table.postId), 
}));
