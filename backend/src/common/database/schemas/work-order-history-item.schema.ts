import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { workOrders } from './work-order.schema';

export const workOrderHistoryItems = pgTable('work_order_history_items', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  workOrderId: uuid('work_order_id')
    .notNull()
    .references(() => workOrders.id, { onDelete: 'cascade' }),
  workerId: uuid('worker_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  text: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
