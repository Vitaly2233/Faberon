import { Injectable } from '@nestjs/common';
import type { Contact } from '../domain/customer';
import {
  CustomerDetailsAlreadyExistError,
  CustomerNotFoundError,
} from '../domain/customer.errors';
import { ContactRepository } from '../infrastructure/database/contact.repository';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { CreateContactRequest } from '../presentation/http/contact.dto';
import type { CustomerContext } from './customer.context';

@Injectable()
export class ContactService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(
    customerId: string,
    input: CreateContactRequest,
    ctx: CustomerContext = {},
  ): Promise<Contact> {
    const customer =
      ctx.customer?.id === customerId
        ? ctx.customer
        : await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new CustomerNotFoundError(customerId);
    }
    if (await this.contactRepository.findByCustomerId(customerId)) {
      throw new CustomerDetailsAlreadyExistError('contact');
    }
    return this.contactRepository.create({ customerId, ...input });
  }
}
