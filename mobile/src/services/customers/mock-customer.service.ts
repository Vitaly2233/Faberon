import { createApiError } from '@/services/api/errors';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { mockCustomers } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import type { CustomerProfile, CustomerService } from '@/services/customers/customer.service';
import type { UpdateCustomerProfileFormValues } from '@/schemas/profile.schema';
import type { CustomerCompany } from '@/types/customer';

let customers = clone(mockCustomers);

function findCurrentCompany(session: Awaited<ReturnType<typeof mockAuthService.getSession>>) {
  const customerId = session?.user.customerId;
  const company = customers.find((item) => item.id === customerId) ?? customers[0];

  if (!company || !session) {
    return null;
  }

  return { company, session };
}

function toProfile(company: CustomerCompany, session: NonNullable<Awaited<ReturnType<typeof mockAuthService.getSession>>>): CustomerProfile {
  const defaultContact =
    company.contacts.find((contact) => contact.id === company.defaultContactId) ??
    company.contacts.find((contact) => contact.isDefault) ??
    company.contacts[0];

  return {
    company: clone(company),
    email: session.user.email,
    displayName: defaultContact?.name ?? session.user.displayName,
  };
}

export class MockCustomerService implements CustomerService {
  async getCurrentCompany() {
    await delay();
    const session = await mockAuthService.getSession();
    const current = findCurrentCompany(session);

    if (!current) {
      throw createApiError('CUSTOMER_NOT_FOUND', 'Customer company does not exist');
    }

    return clone(current.company);
  }

  async getProfile() {
    await delay();
    const session = await mockAuthService.getSession();
    const current = findCurrentCompany(session);

    if (!current) {
      throw createApiError('CUSTOMER_NOT_FOUND', 'Customer company does not exist');
    }

    return toProfile(current.company, current.session);
  }

  async updateProfile(input: UpdateCustomerProfileFormValues) {
    await delay(200);
    const session = await mockAuthService.getSession();
    const current = findCurrentCompany(session);

    if (!current) {
      throw createApiError('CUSTOMER_NOT_FOUND', 'Customer company does not exist');
    }

    const defaultContactId = current.company.defaultContactId ?? current.company.contacts[0]?.id;
    const nextContacts = current.company.contacts.map((contact) =>
      contact.id === defaultContactId
        ? {
            ...contact,
            name: input.contactPersonName,
            email: input.email,
            phone: input.phone || contact.phone,
            isDefault: true,
          }
        : contact,
    );

    const updatedCompany: CustomerCompany = {
      ...current.company,
      companyName: input.companyName,
      defaultAddress: input.defaultAddress,
      contacts: nextContacts.length > 0 ? nextContacts : current.company.contacts,
    };

    customers = customers.map((company) =>
      company.id === updatedCompany.id ? updatedCompany : company,
    );

    const nextSession = {
      ...current.session,
      user: {
        ...current.session.user,
        email: input.email,
        displayName: input.contactPersonName,
      },
    };

    await mockAuthService.saveSession(nextSession);

    return toProfile(updatedCompany, nextSession);
  }
}

export const mockCustomerService = new MockCustomerService();
