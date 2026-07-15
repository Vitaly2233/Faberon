import { Injectable } from '@nestjs/common';
import type { InferSelectModel } from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { customers } from '../../../../common/database/schemas/customer.schema';
import { Customer } from '../../domain/customer';

@Injectable()
export class CustomerRepository extends CrudRepository<
  typeof customers,
  typeof customers.id,
  Customer
> {
  constructor(database: DatabaseService) {
    super(database, customers, customers.id);
  }

  protected toDomain(row: InferSelectModel<typeof customers>): Customer {
    return new Customer(
      row.id,
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
