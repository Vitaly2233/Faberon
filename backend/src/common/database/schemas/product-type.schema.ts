import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { productCategories } from './product-category.schema';

export const productTypes = pgTable('product_types', {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => productCategories.id, { onDelete: 'cascade' }),
  name: varchar({ length: 120 }).notNull(),
});
