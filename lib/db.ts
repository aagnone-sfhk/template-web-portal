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

// Ensures the items table exists in the database and seeds it with sample data
export async function ensureItemsTable(): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      status VARCHAR(50) DEFAULT 'active',
      website VARCHAR(255),
      image_url VARCHAR(255),
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Add unique constraint on name if it doesn't exist
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'items_name_unique'
      ) THEN
        ALTER TABLE public.items ADD CONSTRAINT items_name_unique UNIQUE (name);
      END IF;
    END $$;
  `);

  // Check if table is empty and seed with sample data
  const result = await client.query('SELECT COUNT(*) FROM public.items');
  const itemCount = parseInt(result.rows[0].count, 10);

  if (itemCount === 0) {
    const seedItems = [
      { name: 'Sales Cloud', description: 'Complete CRM platform for sales teams to manage leads, opportunities, and customer relationships', status: 'active', website: 'https://www.salesforce.com/products/sales-cloud/overview/' },
      { name: 'Service Cloud', description: 'Customer service platform with case management, knowledge base, and omni-channel support', status: 'active', website: 'https://www.salesforce.com/products/service-cloud/overview/' },
      { name: 'Marketing Cloud', description: 'Digital marketing platform for email, mobile, social, and advertising campaigns', status: 'active', website: 'https://www.salesforce.com/products/marketing-cloud/overview/' },
      { name: 'Commerce Cloud', description: 'E-commerce platform for B2C and B2B online storefronts and order management', status: 'active', website: 'https://www.salesforce.com/products/commerce-cloud/overview/' },
      { name: 'Experience Cloud', description: 'Build branded portals, forums, and communities for customers and partners', status: 'active', website: 'https://www.salesforce.com/products/experience-cloud/overview/' },
      { name: 'Tableau', description: 'Visual analytics platform for business intelligence and data visualization', status: 'active', website: 'https://www.tableau.com/' },
      { name: 'MuleSoft', description: 'Integration platform for connecting applications, data, and devices with APIs', status: 'active', website: 'https://www.mulesoft.com/' },
      { name: 'Slack', description: 'Team collaboration hub for messaging, file sharing, and workflow automation', status: 'active', website: 'https://slack.com/' },
      { name: 'Heroku', description: 'Cloud platform for building, deploying, and scaling applications', status: 'active', website: 'https://www.heroku.com/' },
      { name: 'Data Cloud', description: 'Customer data platform for unifying and activating real-time customer profiles', status: 'active', website: 'https://www.salesforce.com/products/data-cloud/overview/' },
      { name: 'Einstein AI', description: 'AI-powered analytics, predictions, and recommendations across Salesforce products', status: 'active', website: 'https://www.salesforce.com/artificial-intelligence/' },
      { name: 'Agentforce', description: 'Autonomous AI agents for customer service, sales, and business automation', status: 'active', website: 'https://www.salesforce.com/agentforce/' },
      { name: 'Flow Builder', description: 'Declarative automation tool for building business processes without code', status: 'active', website: 'https://help.salesforce.com/s/articleView?id=sf.flow.htm' },
      { name: 'Apex Developer Guide', description: 'Documentation for Salesforce proprietary programming language for custom logic', status: 'active', website: 'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/' },
      { name: 'Lightning Web Components', description: 'Modern JavaScript framework for building Salesforce UI components', status: 'active', website: 'https://developer.salesforce.com/docs/component-library/documentation/en/lwc' },
      { name: 'SOQL Reference', description: 'Salesforce Object Query Language documentation for data retrieval', status: 'active', website: 'https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/' },
      { name: 'Trailhead', description: 'Free online learning platform for Salesforce skills and certifications', status: 'active', website: 'https://trailhead.salesforce.com/' },
      { name: 'AppExchange', description: 'Marketplace for Salesforce apps, components, and consulting partners', status: 'active', website: 'https://appexchange.salesforce.com/' },
      { name: 'Salesforce CLI', description: 'Command-line interface for Salesforce development and deployment workflows', status: 'inactive', website: 'https://developer.salesforce.com/tools/salesforcecli' },
      { name: 'Platform Events', description: 'Event-driven architecture for real-time integrations and pub/sub messaging', status: 'active', website: 'https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/' },
    ];

    const insertQuery = `
      INSERT INTO public.items (name, description, status, website, is_deleted, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `;

    for (const item of seedItems) {
      await client.query(insertQuery, [
        item.name,
        item.description,
        item.status,
        item.website,
        item.status === 'inactive'
      ]);
    }
  }
}

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
