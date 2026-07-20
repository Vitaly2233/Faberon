import { Injectable } from '@nestjs/common';
import type { Contact } from '../domain/customer';
import {
  ContactNotFoundError,
  CustomerDetailsAlreadyExistError,
} from '../domain/customer.errors';
import { ContactRepository } from '../infrastructure/database/contact.repository';
import type {
  CreateContactRequest,
  UpdateContactRequest,
} from '../presentation/http/contact.dto';
import { CustomerService } from './customer.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(
    companyId: string,
    customerId: string,
    input: CreateContactRequest,
  ): Promise<Contact> {
    const customer = await this.customerService.requireById(
      companyId,
      customerId,
    );

    if (await this.contactRepository.findByCustomerId(customer.id)) {
      throw new CustomerDetailsAlreadyExistError('contact');
    }
    return this.contactRepository.create({ customerId: customer.id, ...input });
  }

  async find(companyId: string, customerId: string): Promise<Contact> {
    await this.customerService.requireById(companyId, customerId);
    const contact = await this.contactRepository.findByCustomerId(customerId);
    if (!contact) throw new ContactNotFoundError(customerId);
    return contact;
  }

  async update(
    companyId: string,
    customerId: string,
    input: UpdateContactRequest,
  ): Promise<Contact> {
    await this.customerService.requireById(companyId, customerId);
    const existing = await this.contactRepository.findByCustomerId(customerId);
    if (!existing) throw new ContactNotFoundError(customerId);
    const updated = await this.contactRepository.updateById(existing.id, input);
    if (!updated) throw new ContactNotFoundError(customerId);
    return updated;
  }

  async delete(companyId: string, customerId: string): Promise<Contact> {
    await this.customerService.requireById(companyId, customerId);
    const existing = await this.contactRepository.findByCustomerId(customerId);
    if (!existing) throw new ContactNotFoundError(customerId);
    const deleted = await this.contactRepository.deleteById(existing.id);
    if (!deleted) throw new ContactNotFoundError(customerId);
    return deleted;
  }
}
