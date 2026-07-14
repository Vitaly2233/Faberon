import { randomUUID } from 'node:crypto';
import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { customers } from '../database/schemas/customer.schema';
import { DatabaseError } from 'pg';
import type { Customer } from './customer.domain';

@Injectable()
export class CustomerRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(name: string, email: string): Promise<Customer> {
    const customer = {
      id: randomUUID(),
      name,
      email,
      createdAt: new Date(),
    };

    try {
      const [createdCustomer] = await this.database.db
        .insert(customers)
        .values(customer)
        .returning();
      if (createdCustomer === undefined) {
        throw new Error('Customer was not returned after creation.');
      }
      return createdCustomer;
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
