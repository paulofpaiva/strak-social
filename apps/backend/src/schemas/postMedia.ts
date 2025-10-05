import { pgTable, uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const postMedia = pgTable("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull(),
  order: integer("order").notNull().default(0),
});
