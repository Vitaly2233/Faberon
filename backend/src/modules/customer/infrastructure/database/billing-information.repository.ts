import { Injectable } from '@nestjs/common';
import {
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { CrudRepository } from '../../../../common/database/crud.repository';
import { DatabaseService } from '../../../../common/database/database.service';
import { billingInformation } from '../../../../common/database/schemas/billing-information.schema';
import { isUniqueViolation } from '../../../../common/utils/database-error.util';
import type { BillingInformation } from '../../domain/customer';
import { CustomerDetailsAlreadyExistError } from '../../domain/customer.errors';

@Injectable()
export class BillingInformationRepository extends CrudRepository<
  typeof billingInformation,
  typeof billingInformation.id,
  BillingInformation
> {
  constructor(database: DatabaseService) {
    super(database, billingInformation, billingInformation.id);
  }

  async findByCustomerId(
    customerId: string,
  ): Promise<BillingInformation | null> {
    const [row] = await this.database.db
      .select()
      .from(billingInformation)
      .where(eq(billingInformation.customerId, customerId))
      .limit(1);
    return row === undefined ? null : this.toDomain(row);
  }

  override async create(
    value: InferInsertModel<typeof billingInformation>,
  ): Promise<BillingInformation> {
    try {
      return await super.create(value);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new CustomerDetailsAlreadyExistError('billing information');
      }
      throw error;
    }
  }

  protected toDomain(
    row: InferSelectModel<typeof billingInformation>,
  ): BillingInformation {
    return row;
  }
}
