import { ConflictException, Injectable } from '@nestjs/common';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import { BaseRepository } from '../../common/database/base.repository';
import { DatabaseService } from '../../common/database/database.service';
import { customers } from '../../common/database/schemas/customer.schema';
import type { Customer } from './customer.domain';

@Injectable()
export class CustomerRepository extends BaseRepository<
  typeof customers,
  typeof customers.id,
  Customer
> {
  constructor(database: DatabaseService) {
    super(database, customers, customers.id);
  }

  protected toDomain(row: InferSelectModel<typeof customers>): Customer {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
    };
  }

  override async create(
    input: InferInsertModel<typeof customers>,
  ): Promise<Customer> {
    try {
      return await super.create(input);
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.cause : undefined;
      if (cause instanceof DatabaseError && cause.code === '23505') {
        throw new ConflictException(
          'A customer with this email already exists.',
        );
      }
      throw error;
    }
  }
}
