import { sql } from 'drizzle-orm';
import { date, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './company.schema';
import { customers } from './customer.schema';
import { productTypes } from './product-type.schema';

export const productOwnershipEnum = pgEnum('product_ownership', [
  'by_client',
  'rented',
]);

export const products = pgTable('products', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  typeId: uuid('type_id')
    .notNull()
    .references(() => productTypes.id, { onDelete: 'restrict' }),
  manufacturer: varchar({ length: 120 }).notNull(),
  model: varchar({ length: 120 }).notNull(),
  serialNumber: varchar('serial_number', { length: 120 }).notNull(),
  address: varchar({ length: 240 }),
  contactName: varchar('contact_name', { length: 120 }),
  warrantyDate: date('warranty_date'),
  ownership: productOwnershipEnum().notNull(),
});
