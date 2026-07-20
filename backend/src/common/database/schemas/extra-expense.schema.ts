import { sql } from 'drizzle-orm';
import {
  boolean,
  numeric,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { workOrders } from './work-order.schema';

export const extraExpenses = pgTable('extra_expenses', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  workOrderId: uuid('work_order_id')
    .notNull()
    .references(() => workOrders.id, { onDelete: 'cascade' }),
  name: varchar({ length: 200 }).notNull(),
  price: numeric({ precision: 12, scale: 2 }).notNull(),
  isHidden: boolean('is_hidden').notNull().default(false),
});
