import { uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { strakSchema } from "./auth";
import { posts } from "./posts";

export const postMedia = strakSchema.table("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull(),
  order: integer("order").notNull().default(0),
});
