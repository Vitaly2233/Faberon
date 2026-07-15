import { Injectable } from '@nestjs/common';
import type { BillingInformation } from '../domain/customer';
import {
  CustomerDetailsAlreadyExistError,
  CustomerNotFoundError,
} from '../domain/customer.errors';
import { BillingInformationRepository } from '../infrastructure/database/billing-information.repository';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import type { CreateBillingInformationRequest } from '../presentation/http/billing-information.dto';
import type { CustomerContext } from './customer.context';
import { NotFoundError } from '../../../common/errors/application.error';

@Injectable()
export class BillingInformationService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly billingInformationRepository: BillingInformationRepository,
  ) {}

  async create(
    customerId: string,
    input: CreateBillingInformationRequest,
    ctx: CustomerContext = {},
  ): Promise<BillingInformation> {
    const customer =
      ctx.customer?.id === customerId
        ? ctx.customer
        : await this.customerRepository.findById(customerId);
    if (!customer) throw new CustomerNotFoundError(customerId);

    if (await this.billingInformationRepository.findByCustomerId(customerId)) {
      throw new CustomerDetailsAlreadyExistError('billing information');
    }

    return this.billingInformationRepository.create({ customerId, ...input });
  }
}
