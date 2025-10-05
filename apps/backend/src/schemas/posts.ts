import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./auth";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(280, 'Post must have at most 280 characters'),
  media: z.array(z.object({
    mediaUrl: z.string().url('Invalid media URL'),
    mediaType: z.enum(['image', 'gif', 'video'], {
      errorMap: () => ({ message: 'Media type must be image, gif, or video' })
    }),
    order: z.number().int().min(0).max(2, 'Maximum 3 media items allowed')
  })).max(3, 'Maximum 3 media items allowed').optional(),
});
