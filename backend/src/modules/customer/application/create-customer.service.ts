import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_MANAGER,
  type TransactionManager,
} from '../../../common/application/transaction-manager';
import type { Customer } from '../domain/customer';
import type { CreateCustomerRequest } from '../presentation/http/customer.dto';
import { ContactService } from './contact.service';
import { CustomerService } from './customer.service';

@Injectable()
export class CreateCustomerService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly contactService: ContactService,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  create(
    companyId: string,
    input: CreateCustomerRequest,
  ): Promise<Customer> {
    return this.transactionManager.runInTransaction(async () => {
      const { contact, ...customerInput } = input;
      const customer = await this.customerService.create(
        companyId,
        customerInput,
      );

      if (contact) {
        await this.contactService.create(companyId, customer.id, contact);
      }

      return customer;
    });
  }
}
