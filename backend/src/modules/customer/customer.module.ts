import { Module } from '@nestjs/common';
import { ContactService } from './application/contact.service';
import { CreateCustomerService } from './application/create-customer.service';
import { CustomerService } from './application/customer.service';
import { ContactRepository } from './infrastructure/database/contact.repository';
import { CustomerRepository } from './infrastructure/database/customer.repository';
import { CustomerController } from './presentation/http/customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerRepository,
    ContactRepository,
    CustomerService,
    ContactService,
    CreateCustomerService,
  ],
  exports: [CustomerRepository, CustomerService],
})
export class CustomerModule {}
