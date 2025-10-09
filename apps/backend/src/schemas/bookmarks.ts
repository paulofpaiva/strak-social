import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./auth";

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniq: uniqueIndex("bookmarks_user_post_idx").on(table.userId, table.postId), 
}));

