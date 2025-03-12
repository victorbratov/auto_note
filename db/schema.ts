import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});

export const records = sqliteTable("records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  collectionId: integer("collection_id")
    .references(() => collections.id)
    .notNull(),
  audioUri: text("audio_uri"),
  textUri: text("text_uri"),
  markdownUri: text("markdown_uri"),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;
export type Record = typeof records.$inferSelect;
export type InsertRecord = typeof records.$inferInsert;
