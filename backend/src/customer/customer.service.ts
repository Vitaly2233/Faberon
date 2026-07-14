import { Injectable } from '@nestjs/common';
import type { Customer } from './customer.domain';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  create(name: string, email: string): Promise<Customer> {
    return this.customerRepository.create(name, email);
  }
}
