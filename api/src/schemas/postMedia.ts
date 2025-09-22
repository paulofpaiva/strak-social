import { uuid, varchar, text, integer } from "drizzle-orm/pg-core";
import { strakSchema } from "./auth";

export const postMedia = strakSchema.table("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull(), // 'image', 'gif', 'video'
  order: integer("order").notNull().default(0), // Para ordenação das mídias
});
