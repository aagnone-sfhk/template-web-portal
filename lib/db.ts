import 'server-only';

import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  pgTable,
  pgSchema,
  text,
  varchar,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  boolean,
  date,
  doublePrecision
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const client = new Client({
  connectionString: process.env.DATABASE_URL?.replace('postgres://', 'postgresql://'),
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

export const db = drizzle(client);

export const salesforceSchema = pgSchema('salesforce');

export const products = salesforceSchema.table('vendorproduct__c', {
  // Primary key - integer with auto-increment
  id: serial('id').primaryKey(),
  
  // Salesforce ID
  sfid: varchar('sfid'),
  
  // Core product fields
  name: varchar('name'), // VendorProduct Name
  imageUrl: varchar('image_url__c'),
  
  // Product attributes with Salesforce naming
  asinComplianceDetail: varchar('asin_compliance_detail__c'),
  asinCompliance: varchar('asin_compliance__c'),
  asin: varchar('asin__c'),
  about: varchar('about__c'),
  caseRef: varchar('case__c'), // reference to Case
  catalogStatus: varchar('catalogstatus__c'),
  category: varchar('category__c'),
  color: varchar('color__c'),
  displayStatus: varchar('display_status__c'),
  externalId: varchar('external_id__c'),
  gtin: varchar('gtin__c'),
  material: varchar('material__c'),
  sku: varchar('sku__c'),
  size: varchar('size__c'),
  title: varchar('title__c'),
  vendor: varchar('vendor__c'), // reference to Vendor
  
  // Numeric fields
  price: doublePrecision('price__c'),
  quantity: doublePrecision('quantity__c'),
  weight: doublePrecision('weight__c'),
  
  // System fields
  currencyIsoCode: varchar('currencyisocode'),
  isDeleted: boolean('isdeleted'),
  createdById: varchar('createdbyid'),
  createdDate: timestamp('createddate'),
  lastModifiedById: varchar('lastmodifiedbyid'),
  lastModifiedDate: timestamp('lastmodifieddate'),
  lastReferencedDate: timestamp('lastreferenceddate'),
  lastActivityDate: date('lastactivitydate'),
  lastViewedDate: timestamp('lastvieweddate'),
  systemModstamp: timestamp('systemmodstamp'),
  
  // HerokuConnect fields
  _hcLastOp: varchar('_hc_lastop'),
  _hcErr: text('_hc_err'),
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}
