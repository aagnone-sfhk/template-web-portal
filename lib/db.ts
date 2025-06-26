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
import { count, eq, ilike, desc } from 'drizzle-orm';
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

export const vendors = salesforceSchema.table('vendor__c', {
  // Primary key - integer with auto-increment
  id: serial('id').primaryKey(),
  
  // Salesforce ID
  sfid: varchar('sfid', { length: 18 }),
  
  // Core vendor fields
  name: varchar('name', { length: 80 }),
  website: varchar('website__c', { length: 255 }),
  
  // System fields
  currencyIsoCode: varchar('currencyisocode', { length: 255 }),
  externalId: varchar('external_id__c', { length: 255 }),
  ownerId: varchar('ownerid', { length: 18 }),
  createdById: varchar('createdbyid', { length: 18 }),
  lastModifiedById: varchar('lastmodifiedbyid', { length: 18 }),
  createdDate: timestamp('createddate'),
  lastModifiedDate: timestamp('lastmodifieddate'),
  systemModstamp: timestamp('systemmodstamp'),
  isDeleted: boolean('isdeleted'),
  
  // HerokuConnect fields
  _hcLastOp: varchar('_hc_lastop', { length: 32 }),
  _hcErr: text('_hc_err'),
});

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

export const cases = salesforceSchema.table('case', {
  // Primary key - integer with auto-increment
  id: serial('id').primaryKey(),
  
  // Salesforce ID
  sfid: varchar('sfid', { length: 18 }),
  
  // Contact information
  contactMobile: varchar('contactmobile', { length: 40 }),
  contactPhone: varchar('contactphone', { length: 40 }),
  contactEmail: varchar('contactemail', { length: 80 }),
  contactFax: varchar('contactfax', { length: 40 }),
  contactId: varchar('contactid', { length: 18 }),
  
  // Supplied information
  suppliedName: varchar('suppliedname', { length: 80 }),
  suppliedPhone: varchar('suppliedphone', { length: 40 }),
  suppliedEmail: varchar('suppliedemail', { length: 80 }),
  suppliedCompany: varchar('suppliedcompany', { length: 80 }),
  
  // Case details
  caseNumber: varchar('casenumber', { length: 30 }),
  subject: varchar('subject', { length: 255 }),
  description: text('description'),
  comments: varchar('comments', { length: 4000 }),
  status: varchar('status', { length: 255 }),
  priority: varchar('priority', { length: 255 }),
  reason: varchar('reason', { length: 255 }),
  origin: varchar('origin', { length: 255 }),
  
  // References
  accountId: varchar('accountid', { length: 18 }),
  parentId: varchar('parentid', { length: 18 }),
  masterRecordId: varchar('masterrecordid', { length: 18 }),
  productId: varchar('productid', { length: 18 }),
  assetId: varchar('assetid', { length: 18 }),
  vendorProduct: varchar('vendorproduct__c', { length: 18 }),
  recordTypeId: varchar('recordtypeid', { length: 18 }),
  
  // Service and entitlement
  serviceContractId: varchar('servicecontractid', { length: 18 }),
  entitlementId: varchar('entitlementid', { length: 18 }),
  assetWarrantyId: varchar('assetwarrantyid', { length: 18 }),
  businessHoursId: varchar('businesshoursid', { length: 18 }),
  
  // Status and flags
  isClosed: boolean('isclosed'),
  isDeleted: boolean('isdeleted'),
  isEscalated: boolean('isescalated'),
  isClosedOnCreate: boolean('isclosedoncreate'),
  isSelfServiceClosed: boolean('isselfserviceclosed'),
  hasSelfServiceComments: boolean('hasselfservicecomments'),
  hasCommentsUnreadByOwner: boolean('hascommentsunreadbyowner'),
  
  // Milestone and assignment
  milestoneStatus: varchar('milestonestatus', { length: 30 }),
  caseAssignmentTimestamp: timestamp('case_assignment_timestamp__c'),
  
  // System fields
  ownerId: varchar('ownerid', { length: 18 }),
  createdById: varchar('createdbyid', { length: 18 }),
  createdDate: timestamp('createddate'),
  lastModifiedById: varchar('lastmodifiedbyid', { length: 18 }),
  lastModifiedDate: timestamp('lastmodifieddate'),
  lastReferencedDate: timestamp('lastreferenceddate'),
  lastViewedDate: timestamp('lastvieweddate'),
  closedDate: timestamp('closeddate'),
  systemModstamp: timestamp('systemmodstamp'),
  
  // External references
  externalId: varchar('external_id__c', { length: 255 }),
  refId: varchar('ref_id__c', { length: 255 }),
  sourceId: varchar('sourceid', { length: 18 }),
  feedItemId: varchar('feeditemid', { length: 18 }),
  
  // HerokuConnect fields
  _hcLastOp: varchar('_hc_lastop', { length: 32 }),
  _hcErr: text('_hc_err'),
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export type SelectVendor = typeof vendors.$inferSelect;
export const insertVendorSchema = createInsertSchema(vendors);

export const contacts = salesforceSchema.table('contact', {
  // Primary key - integer with auto-increment
  id: serial('id').primaryKey(),
  
  // Salesforce ID - with COLLATE constraint like in SQL
  sfid: varchar('sfid', { length: 18 }),
  
  // Core contact fields
  firstName: varchar('firstname', { length: 40 }),
  lastName: varchar('lastname', { length: 80 }),
  name: varchar('name', { length: 121 }),
  email: varchar('email', { length: 80 }),
  
  // Phone numbers
  phone: varchar('phone', { length: 40 }),
  mobilePhone: varchar('mobilephone', { length: 40 }),
  homePhone: varchar('homephone', { length: 40 }),
  assistantPhone: varchar('assistantphone', { length: 40 }),
  
  // Personal information
  birthdate: date('birthdate'),
  gender: varchar('gender', { length: 255 }),
  title: varchar('title', { length: 128 }),
  titleType: varchar('titletype', { length: 255 }),
  department: varchar('department', { length: 80 }),
  departmentGroup: varchar('departmentgroup', { length: 255 }),
  
  // Assistant information
  assistantName: varchar('assistantname', { length: 40 }),
  
  // References
  accountId: varchar('accountid', { length: 18 }),
  individualId: varchar('individualid', { length: 18 }),
  activityMetricId: varchar('activitymetricid', { length: 18 }),
  
  // Additional fields
  description: text('description'),
  leadSource: varchar('leadsource', { length: 255 }),
  contactSource: varchar('contactsource', { length: 255 }),
  buyerAttributes: varchar('buyerattributes', { length: 4099 }),
  
  // System fields
  currencyIsoCode: varchar('currencyisocode', { length: 255 }),
  externalId: varchar('external_id__c', { length: 255 }),
  ownerId: varchar('ownerid', { length: 18 }),
  createdById: varchar('createdbyid', { length: 18 }),
  createdDate: timestamp('createddate'),
  lastActivityDate: date('lastactivitydate'),
  lastReferencedDate: timestamp('lastreferenceddate'),
  lastViewedDate: timestamp('lastvieweddate'),
  systemModstamp: timestamp('systemmodstamp'),
  isDeleted: boolean('isdeleted'),
  
  // HerokuConnect fields
  _hcLastOp: varchar('_hc_lastop', { length: 32 }),
  _hcErr: text('_hc_err'),
});

export type SelectCase = typeof cases.$inferSelect;
export const insertCaseSchema = createInsertSchema(cases);

export type SelectContact = typeof contacts.$inferSelect;
export const insertContactSchema = createInsertSchema(contacts);

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

export async function getPartners(
  search: string,
  offset: number
): Promise<{
  partners: SelectVendor[];
  newOffset: number | null;
  totalPartners: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      partners: await db
        .select()
        .from(vendors)
        .where(ilike(vendors.name, `%${search}%`))
        .limit(1000).orderBy(desc(vendors.lastModifiedDate)),
      newOffset: null,
      totalPartners: 0
    };
  }

  if (offset === null) {
    return { partners: [], newOffset: null, totalPartners: 0 };
  }

  let totalPartners = await db.select({ count: count() }).from(vendors);
  let morePartners = await db.select().from(vendors).limit(5).orderBy(desc(vendors.lastModifiedDate)).offset(offset);
  let newOffset = morePartners.length >= 5 ? offset + 5 : null;

  return {
    partners: morePartners,
    newOffset,
    totalPartners: totalPartners[0].count
  };
}

// Dashboard statistics functions
export async function getDashboardStats() {
  const [totalProducts, totalVendors, activeVendors, recentProducts] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(vendors),
    db.select({ count: count() }).from(vendors).where(eq(vendors.isDeleted, false)),
    db.select().from(products).orderBy(desc(products.createdDate)).limit(5)
  ]);

  return {
    totalProducts: totalProducts[0].count,
    totalVendors: totalVendors[0].count,
    activeVendors: activeVendors[0].count,
    recentProducts: recentProducts
  };
}

export async function getRecentActivity() {
  const [recentContacts, recentVendors] = await Promise.all([
    db.select().from(contacts).orderBy(desc(contacts.systemModstamp)).limit(3),
    db.select().from(vendors).orderBy(desc(vendors.lastModifiedDate)).limit(3)
  ]);

  return {
    recentContacts,
    recentVendors
  };
}
