import type {
  BackendContactResponse,
  BackendCustomerResponse,
} from '@/services/api/backend-types';
import type { CustomerCompany, Contact } from '@/types/customer';

function mapContact(contact: BackendContactResponse): Contact {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone ?? undefined,
    email: contact.email ?? undefined,
    isDefault: true,
  };
}

export function mapCustomerToCompany(
  customer: BackendCustomerResponse,
  contact?: BackendContactResponse | null,
): CustomerCompany {
  const contacts = contact ? [mapContact(contact)] : [];

  return {
    id: customer.id,
    tenantId: customer.companyId,
    companyName: customer.name,
    defaultAddress: customer.address ?? '',
    defaultContactId: contact?.id,
    contacts,
  };
}
