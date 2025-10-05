import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./auth";
import { z } from "zod";

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentCommentId: uuid("parent_comment_id"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(280, 'Comment must have at most 280 characters'),
  parentCommentId: z.string().uuid().optional(),
  media: z.array(z.object({
    mediaUrl: z.string().url(),
    mediaType: z.enum(['image', 'gif', 'video']),
    order: z.number().int().min(0)
  })).optional()
});

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(280, 'Comment must have at most 280 characters'),
  parentCommentId: z.string().uuid().optional(),
  media: z.array(z.object({
    mediaUrl: z.string().url(),
    mediaType: z.enum(['image', 'gif', 'video']),
    order: z.number().int().min(0)
  })).optional()
});