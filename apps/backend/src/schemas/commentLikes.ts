import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { comments } from "./comments";
import { users } from "./auth";

export const commentLikes = pgTable("comment_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // user can only like a comment once
  uniq: uniqueIndex("comment_likes_user_comment_idx").on(table.userId, table.commentId), 
}));
