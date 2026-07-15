import { sql } from 'drizzle-orm';
import { pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const companies = pgTable(
  'companies',
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    name: varchar({ length: 120 }).notNull(),
  },
  (table) => [uniqueIndex('companies_name_unique').on(table.name)],
);
