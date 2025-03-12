import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "./db";
import { collections, records } from "./schema";
import { eq } from "drizzle-orm";
import type { InsertCollection, InsertRecord } from "./schema";

// Collection hooks
export function useCollections() {
  return useLiveQuery(
    db.select().from(collections)
  );
}

export function useCollection(id: number) {
  return useLiveQuery(
    db.select()
      .from(collections)
      .where(eq(collections.id, id))
  ).data?.[0];
}

export async function createCollection(data: InsertCollection) {
  return await db.insert(collections).values(data).returning();
}

export async function updateCollection(id: number, data: Partial<InsertCollection>) {
  return await db
    .update(collections)
    .set(data)
    .where(eq(collections.id, id))
    .returning();
}

export async function deleteCollection(id: number) {
  return await db
    .delete(collections)
    .where(eq(collections.id, id))
    .returning();
}

// Record hooks
export function useRecords() {
  return useLiveQuery(
    db.select().from(records)
  );
}

export function useRecord(id: number) {
  return useLiveQuery(
    db.select()
      .from(records)
      .where(eq(records.id, id))
  ).data?.[0];
}

export function useRecordsByCollection(collectionId: number) {
  return useLiveQuery(
    db.select()
      .from(records)
      .where(eq(records.collectionId, collectionId))
  );
}

export async function createRecord(data: InsertRecord) {
  return await db.insert(records).values(data).returning();
}

export async function updateRecord(id: number, data: Partial<InsertRecord>) {
  return await db
    .update(records)
    .set(data)
    .where(eq(records.id, id))
    .returning();
}

export async function deleteRecord(id: number) {
  return await db
    .delete(records)
    .where(eq(records.id, id))
    .returning();
}