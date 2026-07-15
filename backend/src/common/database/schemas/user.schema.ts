import { sql } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { companies } from './company.schema';

export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    email: varchar({ length: 320 }).notNull(),
    passwordHash: text('password_hash').notNull(),
  },
  (table) => [
    uniqueIndex('users_company_id_email_unique').on(
      table.companyId,
      table.email,
    ),
  ],
);
