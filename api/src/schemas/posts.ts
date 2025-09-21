import { serial, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users, strakSchema } from "./auth.js";

export const posts = strakSchema.table("posts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 150 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
