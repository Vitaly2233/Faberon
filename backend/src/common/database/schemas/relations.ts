import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema, (relation) => ({
  companies: {
    users: relation.many.users(),
    customers: relation.many.customers(),
    products: relation.many.products(),
    workOrders: relation.many.workOrders(),
  },
  users: {
    company: relation.one.companies({
      from: relation.users.companyId,
      to: relation.companies.id,
    }),
    workOrders: relation.many.workOrders(),
    workOrderHistoryItems: relation.many.workOrderHistoryItems(),
  },
  customers: {
    company: relation.one.companies({
      from: relation.customers.companyId,
      to: relation.companies.id,
    }),
    contact: relation.one.contacts({
      from: relation.customers.id,
      to: relation.contacts.customerId,
    }),
    products: relation.many.products(),
    workOrders: relation.many.workOrders(),
  },
  contacts: {
    customer: relation.one.customers({
      from: relation.contacts.customerId,
      to: relation.customers.id,
    }),
  },
  productCategories: {
    types: relation.many.productTypes(),
  },
  productTypes: {
    category: relation.one.productCategories({
      from: relation.productTypes.categoryId,
      to: relation.productCategories.id,
    }),
    products: relation.many.products(),
  },
  products: {
    company: relation.one.companies({
      from: relation.products.companyId,
      to: relation.companies.id,
    }),
    customer: relation.one.customers({
      from: relation.products.customerId,
      to: relation.customers.id,
    }),
    type: relation.one.productTypes({
      from: relation.products.typeId,
      to: relation.productTypes.id,
    }),
    workOrders: relation.many.workOrders(),
  },
  workOrders: {
    company: relation.one.companies({
      from: relation.workOrders.companyId,
      to: relation.companies.id,
    }),
    customer: relation.one.customers({
      from: relation.workOrders.customerId,
      to: relation.customers.id,
    }),
    product: relation.one.products({
      from: relation.workOrders.productId,
      to: relation.products.id,
    }),
    worker: relation.one.users({
      from: relation.workOrders.workerId,
      to: relation.users.id,
    }),
    extraExpenses: relation.many.extraExpenses(),
    historyItems: relation.many.workOrderHistoryItems(),
  },
  extraExpenses: {
    workOrder: relation.one.workOrders({
      from: relation.extraExpenses.workOrderId,
      to: relation.workOrders.id,
    }),
  },
  workOrderHistoryItems: {
    workOrder: relation.one.workOrders({
      from: relation.workOrderHistoryItems.workOrderId,
      to: relation.workOrders.id,
    }),
    worker: relation.one.users({
      from: relation.workOrderHistoryItems.workerId,
      to: relation.users.id,
    }),
  },
}));
