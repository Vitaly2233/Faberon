import { Module } from '@nestjs/common';
import { BillingInformationService } from './application/billing-information.service';
import { ContactService } from './application/contact.service';
import { CustomerService } from './application/customer.service';
import { BillingInformationRepository } from './infrastructure/database/billing-information.repository';
import { ContactRepository } from './infrastructure/database/contact.repository';
import { CustomerRepository } from './infrastructure/database/customer.repository';
import { CustomerController } from './presentation/http/customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerRepository,
    ContactRepository,
    BillingInformationRepository,
    CustomerService,
    ContactService,
    BillingInformationService,
  ],
})
export class CustomerModule {}
