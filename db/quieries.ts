import { eq, like } from "drizzle-orm";
import { collections, records } from "./schema";
import { Collection, InsertCollection, Record, InsertRecord } from "./schema";
import { db } from "./db";

// Collection queries
export async function getAllCollections(): Promise<Collection[]> {
  return await db.select().from(collections);
}

export async function getCollectionById(
  id: number,
): Promise<Collection | undefined> {
  const result = await db
    .select()
    .from(collections)
    .where(eq(collections.id, id));
  return result[0];
}

export async function createCollection(
  data: InsertCollection,
): Promise<Collection> {
  const result = await db.insert(collections).values(data).returning();
  return result[0];
}

export async function updateCollection(
  id: number,
  data: Partial<InsertCollection>,
): Promise<Collection | undefined> {
  const result = await db
    .update(collections)
    .set(data)
    .where(eq(collections.id, id))
    .returning();
  return result[0];
}

export async function deleteCollection(
  id: number,
): Promise<Collection | undefined> {
  const result = await db
    .delete(collections)
    .where(eq(collections.id, id))
    .returning();
  return result[0];
}

// Record queries
export async function getAllRecords(): Promise<Record[]> {
  return await db.select().from(records);
}

export async function getRecordsLike(quiery: string): Promise<Record[]> {
  return await db
    .select()
    .from(records)
    .where(like(records.name, `%${quiery}%`));
}

export async function getRecordById(id: number): Promise<Record | undefined> {
  const result = await db.select().from(records).where(eq(records.id, id));
  return result[0];
}

export async function getRecordsByCollectionId(
  collectionId: number,
): Promise<Record[]> {
  return await db
    .select()
    .from(records)
    .where(eq(records.collectionId, collectionId));
}

export async function createRecord(data: InsertRecord): Promise<Record> {
  const result = await db.insert(records).values(data).returning();
  return result[0];
}

export async function updateRecord(
  id: number,
  data: Partial<InsertRecord>,
): Promise<Record | undefined> {
  const result = await db
    .update(records)
    .set(data)
    .where(eq(records.id, id))
    .returning();
  return result[0];
}

export async function deleteRecord(id: number): Promise<Record | undefined> {
  const result = await db.delete(records).where(eq(records.id, id)).returning();
  return result[0];
}
