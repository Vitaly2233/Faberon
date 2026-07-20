import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const productCategories = pgTable('product_categories', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  name: varchar({ length: 120 }).notNull(),
});
