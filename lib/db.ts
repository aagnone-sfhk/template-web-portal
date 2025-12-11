import 'server-only';

import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  boolean
} from 'drizzle-orm/pg-core';
import { count, eq, ilike, desc } from 'drizzle-orm';

const client = new Client({
  connectionString: process.env.DATABASE_URL?.replace('postgres://', 'postgresql://'),
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

export const db = drizzle(client);

// Generic items table - customize this for your use case
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active'),
  website: varchar('website', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SelectItem = typeof items.$inferSelect;
export type InsertItem = typeof items.$inferInsert;

export async function getItems(
  search: string,
  offset: number
): Promise<{
  items: SelectItem[];
  newOffset: number | null;
  totalItems: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      items: await db
        .select()
        .from(items)
        .where(ilike(items.name, `%${search}%`))
        .limit(1000)
        .orderBy(desc(items.updatedAt)),
      newOffset: null,
      totalItems: 0
    };
  }

  if (offset === null) {
    return { items: [], newOffset: null, totalItems: 0 };
  }

  let totalItems = await db.select({ count: count() }).from(items);
  let moreItems = await db
    .select()
    .from(items)
    .limit(5)
    .orderBy(desc(items.updatedAt))
    .offset(offset);
  let newOffset = moreItems.length >= 5 ? offset + 5 : null;

  return {
    items: moreItems,
    newOffset,
    totalItems: totalItems[0].count
  };
}

export async function deleteItemById(id: number) {
  await db.delete(items).where(eq(items.id, id));
}

// Dashboard statistics functions
export async function getDashboardStats() {
  const [totalItems, activeItems, recentItems] = await Promise.all([
    db.select({ count: count() }).from(items),
    db.select({ count: count() }).from(items).where(eq(items.isDeleted, false)),
    db.select().from(items).orderBy(desc(items.createdAt)).limit(5)
  ]);

  return {
    totalItems: totalItems[0].count,
    activeItems: activeItems[0].count,
    recentItems: recentItems
  };
}

export async function getRecentActivity() {
  const recentItems = await db
    .select()
    .from(items)
    .orderBy(desc(items.updatedAt))
    .limit(5);

  return {
    recentItems
  };
}
