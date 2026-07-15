import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema, (relation) => ({
  customers: {
    contact: relation.one.contacts(),
    billingInformation: relation.one.billingInformation(),
  },
  contacts: {
    customer: relation.one.customers({
      from: relation.contacts.customerId,
      to: relation.customers.id,
    }),
  },
  billingInformation: {
    customer: relation.one.customers({
      from: relation.billingInformation.customerId,
      to: relation.customers.id,
    }),
  },
}));
