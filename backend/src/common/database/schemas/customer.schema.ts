import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const customerTypeEnum = pgEnum('customer_type', [
  'individual',
  'company',
  'government',
]);

export const countryCodeEnum = pgEnum('country_code', ['pl', 'no']);

export const customers = pgTable('customers', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  name: varchar({ length: 120 }).notNull(),
  type: customerTypeEnum().notNull(),
  legalName: varchar('legal_name', { length: 200 }),
  taxNumber: varchar('tax_number', { length: 64 }),
  address: varchar({ length: 240 }),
  city: varchar({ length: 120 }),
  region: varchar({ length: 120 }),
  postalCode: varchar('postal_code', { length: 32 }),
  country: countryCodeEnum(),
  notes: text(),
});
