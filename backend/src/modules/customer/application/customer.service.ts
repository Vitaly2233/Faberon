import { Injectable } from '@nestjs/common';
import { CustomerType, type Customer } from '../domain/customer';
import { CustomerNotFoundError } from '../domain/customer.errors';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { UpdateCustomerRequest } from '../presentation/http/customer.dto';
import type { CreateCustomerInput } from './create-customer.input';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  create(companyId: string, input: CreateCustomerInput): Promise<Customer> {
    return this.customerRepository.create({
      ...input,
      companyId,
      type: input.type ?? CustomerType.Company,
    });
  }

  findAll(companyId: string): Promise<Customer[]> {
    return this.customerRepository.findAll(companyId);
  }

  findById(companyId: string, id: string): Promise<Customer | null> {
    return this.customerRepository.findById(companyId, id);
  }

  async requireById(companyId: string, id: string): Promise<Customer> {
    const customer = await this.findById(companyId, id);
    if (!customer) throw new CustomerNotFoundError(id);
    return customer;
  }

  async update(
    companyId: string,
    id: string,
    input: UpdateCustomerRequest,
  ): Promise<Customer> {
    const customer = await this.customerRepository.updateById(
      companyId,
      id,
      input,
    );
    if (!customer) throw new CustomerNotFoundError(id);
    return customer;
  }

  async delete(companyId: string, id: string): Promise<Customer> {
    const customer = await this.customerRepository.deleteById(companyId, id);
    if (!customer) throw new CustomerNotFoundError(id);
    return customer;
  }
}
