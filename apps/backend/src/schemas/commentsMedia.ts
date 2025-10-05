import { pgTable, uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { comments } from "./comments";

export const commentsMedia = pgTable("comments_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: 'cascade' }).notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull(),
  order: integer("order").notNull().default(0),
});
