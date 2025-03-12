import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const records = sqliteTable("records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  audioUri: text("audio_uri"),
  textUri: text("text_uri"),
  markdownUri: text("markdown_uri"),
});

export type Record = typeof records.$inferSelect;
export type InsertRecord = typeof records.$inferInsert;
