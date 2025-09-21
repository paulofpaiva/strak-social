import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users, strakSchema } from "./auth";

export const comments = strakSchema.table("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
