import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { companies } from './company.schema';
import { customers } from './customer.schema';
import { products } from './product.schema';
import { users } from './user.schema';

export const workOrderStageEnum = pgEnum('work_order_stage', [
  'waiting',
  'diagnostics',
  'waiting-parts',
  'repaired',
]);

export const workOrders = pgTable(
  'work_orders',
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, {
      onDelete: 'set null',
    }),
    workerId: uuid('worker_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    number: integer().notNull(),
    description: text().notNull(),
    stage: workOrderStageEnum().notNull().default('waiting'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    estimatedDate: date('estimated_date'),
    showFinalPrice: boolean('show_final_price').notNull().default(false),
  },
  (table) => [
    uniqueIndex('work_orders_company_id_number_unique').on(
      table.companyId,
      table.number,
    ),
  ],
);
