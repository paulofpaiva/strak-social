import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { lists } from "./lists";
import { posts } from "./posts";
import { users } from "./auth";

export const listPosts = pgTable("list_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("list_id").notNull().references(() => lists.id, { onDelete: 'cascade' }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  addedBy: uuid("added_by").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniq: uniqueIndex("list_posts_list_post_idx").on(table.listId, table.postId),
}));

