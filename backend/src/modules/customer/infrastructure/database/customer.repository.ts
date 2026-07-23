import { Injectable } from '@nestjs/common';
import { type InferSelectModel } from 'drizzle-orm';
import { DatabaseService } from '../../../../common/database/database.service';
import { customers } from '../../../../common/database/schemas/customer.schema';
import { TenantCrudRepository } from '../../../../common/database/tenant-crud.repository';
import { Customer } from '../../domain/customer';

export const CUSTOMER_LIST_POPULATE = ['contact'] as const;

export type CustomerListPopulate = (typeof CUSTOMER_LIST_POPULATE)[number];

@Injectable()
export class CustomerRepository extends TenantCrudRepository<
  typeof customers,
  typeof customers.id,
  typeof customers.companyId,
  Customer
> {
  constructor(database: DatabaseService) {
    super(database, customers, customers.id, customers.companyId);
  }

  protected toDomain(row: InferSelectModel<typeof customers>): Customer {
    return new Customer(
      row.id,
      row.companyId,
      row.name,
      row.type,
      row.legalName,
      row.taxNumber,
      row.address,
      row.city,
      row.region,
      row.postalCode,
      row.country,
      row.notes,
    );
  }
}
