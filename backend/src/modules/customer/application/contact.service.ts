import { Injectable } from '@nestjs/common';
import type { Contact } from '../domain/customer';
import {
  CustomerDetailsAlreadyExistError,
  CustomerNotFoundError,
} from '../domain/customer.errors';
import { ContactRepository } from '../infrastructure/database/contact.repository';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { CreateContactRequest } from '../presentation/http/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(
    customerId: string,
    input: CreateContactRequest,
  ): Promise<Contact> {
    if (!(await this.customerRepository.findById(customerId))) {
      throw new CustomerNotFoundError(customerId);
    }
    if (await this.contactRepository.findByCustomerId(customerId)) {
      throw new CustomerDetailsAlreadyExistError('contact');
    }
    return this.contactRepository.create({ customerId, ...input });
  }
}
