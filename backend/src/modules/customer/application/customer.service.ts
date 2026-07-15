import { Injectable } from '@nestjs/common';
import type { Customer } from '../domain/customer';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { CreateCustomerRequest } from '../presentation/http/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  findById(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  create(input: CreateCustomerRequest): Promise<Customer> {
    return this.customerRepository.create(input);
  }
}
