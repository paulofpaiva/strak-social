import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { lists } from "./lists";
import { users } from "./auth";

export const listMembers = pgTable("list_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("list_id").notNull().references(() => lists.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniq: uniqueIndex("list_members_list_user_idx").on(table.listId, table.userId),
}));

