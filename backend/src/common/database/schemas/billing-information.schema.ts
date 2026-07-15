import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { countryCodeEnum, customers } from './customer.schema';

export const currencyCodeEnum = pgEnum('currency_code', [
  'usd',
  'pln',
  'eur',
  'nok',
]);

export const billingInformation = pgTable(
  'billing_info',
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    address: varchar({ length: 240 }).notNull(),
    city: varchar({ length: 120 }).notNull(),
    region: varchar({ length: 120 }),
    postalCode: varchar('postal_code', { length: 32 }).notNull(),
    country: countryCodeEnum().notNull(),
    dueWithinDays: integer('due_within_days').notNull(),
    currency: currencyCodeEnum().notNull(),
  },
  (table) => [
    uniqueIndex('billing_info_customer_id_unique').on(table.customerId),
    check(
      'billing_info_due_within_days_check',
      sql`${table.dueWithinDays} between 0 and 365`,
    ),
  ],
);
