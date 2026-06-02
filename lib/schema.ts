import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Stores which days are marked done
export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayId: text("day_id").notNull().unique(),   // e.g. "d1", "d18"
  isDone: integer("is_done", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),           // ISO timestamp
});

// Stores per-day notes
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayId: text("day_id").notNull().unique(),
  content: text("content").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});
