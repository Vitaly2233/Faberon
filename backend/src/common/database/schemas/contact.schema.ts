import { sql } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { customers } from './customer.schema';

export const contacts = pgTable(
  'contacts',
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    name: varchar({ length: 120 }).notNull(),
    email: varchar({ length: 320 }),
    phone: varchar({ length: 32 }),
    description: text(),
  },
  (table) => [
    uniqueIndex('contacts_customer_id_unique').on(table.customerId),
  ],
);
