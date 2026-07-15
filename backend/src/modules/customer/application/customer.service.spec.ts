import { describe, expect, it, jest } from '@jest/globals';
import type { TransactionManager } from '../../../common/application/transaction-manager';
import {
  CountryCode,
  CurrencyCode,
  CustomerType,
  type BillingInformation,
  type Contact,
  type Customer,
} from '../domain/customer';
import {
  CustomerDetailsAlreadyExistError,
  CustomerNotFoundError,
} from '../domain/customer.errors';
import { BillingInformationRepository } from '../infrastructure/database/billing-information.repository';
import { ContactRepository } from '../infrastructure/database/contact.repository';
import { CustomerRepository } from '../infrastructure/database/customer.repository';
import { BillingInformationService } from './billing-information.service';
import { ContactService } from './contact.service';
import { CustomerService } from './customer.service';
import type { CreateBillingInformationRequest } from '../presentation/http/billing-information.dto';
import type { CreateContactRequest } from '../presentation/http/contact.dto';
import type { CreateCustomerRequest } from '../presentation/http/customer.dto';

const customerId = '019535d9-3df7-79fb-b466-fa907fa17f9e';
const detailId = '019535d9-3df8-7abc-8def-fa907fa17f9f';

const customer: Customer = {
  id: customerId,
  name: 'Acme AS',
  type: CustomerType.Company,
  legalName: 'Acme AS',
  taxNumber: 'NO999888777',
  address: 'Karl Johans gate 1',
  city: 'Oslo',
  region: 'Oslo',
  postalCode: '0154',
  country: CountryCode.Norway,
  notes: null,
};

describe('CustomerService', () => {
  it('creates a customer with optional contact and billing information', async () => {
    const customerRepository = {
      create: jest
        .fn<CustomerRepository['create']>()
        .mockResolvedValue(customer),
    } as unknown as CustomerRepository;
    const contactService = {
      create: jest.fn<ContactService['create']>().mockResolvedValue({
        id: detailId,
        customerId,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: null,
        description: null,
      }),
    } as unknown as ContactService;
    const billingInformationService = {
      create: jest
        .fn<BillingInformationService['create']>()
        .mockResolvedValue({
          id: detailId,
          customerId,
          address: 'Karl Johans gate 1',
          city: 'Oslo',
          region: null,
          postalCode: '0154',
          country: CountryCode.Norway,
          dueWithinDays: 14,
          currency: CurrencyCode.NorwegianKrone,
        }),
    } as unknown as BillingInformationService;
    const transactionManager = {
      runInTransaction: jest.fn((operation: () => Promise<Customer>) =>
        operation(),
      ),
    } as unknown as TransactionManager;
    const service = new CustomerService(
      customerRepository,
      contactService,
      billingInformationService,
      transactionManager,
    );
    const input: CreateCustomerRequest = {
      name: customer.name,
      type: customer.type,
      legalName: customer.legalName,
      taxNumber: customer.taxNumber,
      address: customer.address,
      city: customer.city,
      region: customer.region,
      postalCode: customer.postalCode,
      country: customer.country,
      notes: customer.notes,
      contact: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: null,
        description: null,
      },
      billingInformation: {
        address: 'Karl Johans gate 1',
        city: 'Oslo',
        region: null,
        postalCode: '0154',
        country: CountryCode.Norway,
        dueWithinDays: 14,
        currency: CurrencyCode.NorwegianKrone,
      },
    };

    await expect(service.create(input)).resolves.toEqual(customer);
    expect(transactionManager.runInTransaction).toHaveBeenCalledTimes(1);
    expect(customerRepository.create).toHaveBeenCalledWith({
      name: customer.name,
      type: customer.type,
      legalName: customer.legalName,
      taxNumber: customer.taxNumber,
      address: customer.address,
      city: customer.city,
      region: customer.region,
      postalCode: customer.postalCode,
      country: customer.country,
      notes: customer.notes,
    });
    expect(contactService.create).toHaveBeenCalledWith(
      customerId,
      input.contact!,
      { customer },
    );
    expect(billingInformationService.create).toHaveBeenCalledWith(
      customerId,
      input.billingInformation!,
      { customer },
    );
  });
});

describe('ContactService', () => {
  it('uses the customer context without querying for the customer again', async () => {
    const contact: Contact = {
      id: detailId,
      customerId,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: null,
      description: 'Primary contact',
    };
    const customerRepository = {
      findById: jest
        .fn<CustomerRepository['findById']>()
        .mockResolvedValue(customer),
    } as unknown as CustomerRepository;
    const contactRepository = {
      findByCustomerId: jest
        .fn<ContactRepository['findByCustomerId']>()
        .mockResolvedValue(null),
      create: jest
        .fn<ContactRepository['create']>()
        .mockResolvedValue(contact),
    } as unknown as ContactRepository;
    const service = new ContactService(
      customerRepository,
      contactRepository,
    );
    const input: CreateContactRequest = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      description: contact.description,
    };

    await expect(
      service.create(customerId, input, { customer }),
    ).resolves.toEqual(contact);
    expect(customerRepository.findById).not.toHaveBeenCalled();
    expect(contactRepository.create).toHaveBeenCalledWith({
      customerId,
      ...input,
    });
  });

  it('rejects a contact for a missing customer', async () => {
    const customerRepository = {
      findById: jest
        .fn<CustomerRepository['findById']>()
        .mockResolvedValue(null),
    } as unknown as CustomerRepository;
    const service = new ContactService(
      customerRepository,
      {} as ContactRepository,
    );

    await expect(
      service.create(customerId, {
        name: 'Ada Lovelace',
        email: null,
        phone: null,
        description: null,
      }),
    ).rejects.toBeInstanceOf(CustomerNotFoundError);
  });
});

describe('BillingInformationService', () => {
  it('uses the customer context when checking for duplicate billing information', async () => {
    const billingInformation: BillingInformation = {
      id: detailId,
      customerId,
      address: 'Karl Johans gate 1',
      city: 'Oslo',
      region: null,
      postalCode: '0154',
      country: CountryCode.Norway,
      dueWithinDays: 14,
      currency: CurrencyCode.NorwegianKrone,
    };
    const customerRepository = {
      findById: jest
        .fn<CustomerRepository['findById']>()
        .mockResolvedValue(customer),
    } as unknown as CustomerRepository;
    const billingRepository = {
      findByCustomerId: jest
        .fn<BillingInformationRepository['findByCustomerId']>()
        .mockResolvedValue(billingInformation),
    } as unknown as BillingInformationRepository;
    const service = new BillingInformationService(
      customerRepository,
      billingRepository,
    );

    const input: CreateBillingInformationRequest = {
      address: billingInformation.address,
      city: billingInformation.city,
      region: billingInformation.region,
      postalCode: billingInformation.postalCode,
      country: billingInformation.country,
      dueWithinDays: billingInformation.dueWithinDays,
      currency: billingInformation.currency,
    };

    await expect(
      service.create(customerId, input, { customer }),
    ).rejects.toBeInstanceOf(CustomerDetailsAlreadyExistError);
    expect(customerRepository.findById).not.toHaveBeenCalled();
  });
});
