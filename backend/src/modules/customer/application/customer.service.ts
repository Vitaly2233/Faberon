import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CustomerType, type Customer } from '../domain/customer';
import { CustomerNotFoundError } from '../domain/customer.errors';
import {
  CustomerRepository,
  type CustomerPopulate,
} from '../infrastructure/database/customer.repository';
import type {
  CustomerResponse,
  UpdateCustomerRequest,
} from '../presentation/http/customer.dto';
import { ContactService } from './contact.service';
import type { CreateCustomerInput } from './create-customer.input';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
  ) {}

  create(companyId: string, input: CreateCustomerInput): Promise<Customer> {
    return this.customerRepository.create({
      ...input,
      companyId,
      type: input.type ?? CustomerType.Company,
    });
  }

  async findAll(
    companyId: string,
    populate: readonly CustomerPopulate[] = [],
  ): Promise<CustomerResponse[]> {
    const customers = await this.customerRepository.findAll(companyId);

    if (!populate.includes('contact')) {
      return customers.map((customer) => customer.toResponse());
    }

    const contacts = await this.contactService.findByCustomerIds(
      customers.map((customer) => customer.id),
    );
    const contactByCustomerId = new Map(
      contacts.map((contact) => [contact.customerId, contact]),
    );

    return customers.map((customer) =>
      customer.toResponse({
        contact: contactByCustomerId.get(customer.id) ?? null,
      }),
    );
  }

  findById(companyId: string, id: string): Promise<Customer | null> {
    return this.customerRepository.findById(companyId, id);
  }

  async findByIdResponse(
    companyId: string,
    id: string,
    populate: readonly CustomerPopulate[] = [],
  ): Promise<CustomerResponse | null> {
    const customer = await this.findById(companyId, id);
    if (!customer) return null;

    if (!populate.includes('contact')) {
      return customer.toResponse();
    }

    const contacts = await this.contactService.findByCustomerIds([id]);
    return customer.toResponse({
      contact: contacts[0] ?? null,
    });
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
