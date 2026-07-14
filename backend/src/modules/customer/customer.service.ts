import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { InferInsertModel } from 'drizzle-orm';
import { customers } from '../../common/database/schemas/customer.schema';
import type { Customer } from './customer.domain';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  create(name: string, email: string): Promise<Customer> {
    const customer: Customer = {
      id: randomUUID(),
      name,
      email,
      createdAt: new Date(),
    };
    return this.customerRepository.create(customer);
  }
}
