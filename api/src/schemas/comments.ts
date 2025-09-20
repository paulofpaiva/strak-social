import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { posts } from "./posts.js";
import { users, strakSchema } from "./auth.js";

export const comments = strakSchema.table("comments", {
  id: serial("id").primaryKey(),
  postId: serial("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
