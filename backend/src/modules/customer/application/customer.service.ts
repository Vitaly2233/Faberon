import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../common/application/transaction-manager';
import type { Customer } from '../domain/customer';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { CreateCustomerRequest } from '../presentation/http/customer.dto';
import { BillingInformationService } from './billing-information.service';
import { ContactService } from './contact.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly contactService: ContactService,
    private readonly billingInformationService: BillingInformationService,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  findById(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  async create(input: CreateCustomerRequest): Promise<Customer> {
    return this.transactionManager.runInTransaction(async () => {
      const { contact, billingInformation, ...customerInput } = input;
      const customer = await this.customerRepository.create(customerInput);
      const ctx = { customer };

      if (contact) {
        await this.contactService.create(customer.id, contact, ctx);
      }
      if (billingInformation) {
        await this.billingInformationService.create(
          customer.id,
          billingInformation,
          ctx,
        );
      }

      return customer;
    });
  }
}
