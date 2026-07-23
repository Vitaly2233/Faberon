import { apiRequest } from '@/services/api/client';
import type {
  BackendContactResponse,
  BackendCustomerResponse,
} from '@/services/api/backend-types';
import { mapCustomerToCompany } from '@/services/api/mappers/customer.mapper';
import { createApiError } from '@/services/api/errors';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { AuthService } from '@/services/auth/auth.service';
import type { CustomerProfile, CustomerService } from '@/services/customers/customer.service';
import type { CustomerCompany } from '@/types/customer';

async function fetchCustomerBundle(
  token: string,
  customerId: string,
): Promise<{ customer: BackendCustomerResponse; contact: BackendContactResponse | null }> {
  const customer = await apiRequest<BackendCustomerResponse>(`/customers/${customerId}`, { token });
  let contact: BackendContactResponse | null = null;
  try {
    contact = await apiRequest<BackendContactResponse>(`/customers/${customerId}/contact`, { token });
  } catch {
    contact = null;
  }
  return { customer, contact };
}

function toProfile(
  company: CustomerCompany,
  session: NonNullable<Awaited<ReturnType<AuthService['getSession']>>>,
): CustomerProfile {
  const defaultContact =
    company.contacts.find((contact) => contact.id === company.defaultContactId) ?? company.contacts[0];

  return {
    company,
    email: defaultContact?.email ?? session.user.email,
    displayName: defaultContact?.name ?? session.user.displayName,
  };
}

export function createHttpCustomerService(auth: AuthService): CustomerService {
  const withToken = createWithAccessToken(auth);

  async function requireCustomerId(): Promise<string> {
    const session = await auth.getSession();
    const customerId = session?.user.customerId;
    if (!session || !customerId) {
      throw createApiError('CUSTOMER_NOT_FOUND', 'Customer account is not linked to a customer record');
    }
    return customerId;
  }

  return {
    getCurrentCompany() {
      return withToken(async (token) => {
        const customerId = await requireCustomerId();
        const { customer, contact } = await fetchCustomerBundle(token, customerId);
        return mapCustomerToCompany(customer, contact);
      });
    },

    getProfile() {
      return withToken(async (token) => {
        const session = await auth.getSession();
        if (!session) {
          throw createApiError('UNAUTHORIZED', 'Not authenticated');
        }
        const customerId = await requireCustomerId();
        const { customer, contact } = await fetchCustomerBundle(token, customerId);
        return toProfile(mapCustomerToCompany(customer, contact), session);
      });
    },

    updateProfile(input) {
      return withToken(async (token) => {
        const session = await auth.getSession();
        if (!session) {
          throw createApiError('UNAUTHORIZED', 'Not authenticated');
        }
        const customerId = await requireCustomerId();

        await apiRequest(`/customers/${customerId}`, {
          method: 'PATCH',
          token,
          body: {
            name: input.companyName,
            address: input.defaultAddress,
          },
        });

        try {
          await apiRequest(`/customers/${customerId}/contact`, {
            method: 'PATCH',
            token,
            body: {
              name: input.contactPersonName,
              email: input.email,
              phone: input.phone ?? null,
            },
          });
        } catch {
          await apiRequest(`/customers/${customerId}/contact`, {
            method: 'POST',
            token,
            body: {
              name: input.contactPersonName,
              email: input.email,
              phone: input.phone ?? null,
            },
          });
        }

        const nextSession = {
          ...session,
          user: {
            ...session.user,
            email: input.email,
            displayName: input.contactPersonName,
          },
        };
        await auth.saveSession(nextSession);

        const { customer, contact } = await fetchCustomerBundle(token, customerId);
        return toProfile(mapCustomerToCompany(customer, contact), nextSession);
      });
    },
  };
}
