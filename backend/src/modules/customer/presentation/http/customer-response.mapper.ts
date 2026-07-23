import type { Contact, Customer } from '../../domain/customer';
import { toContactResponse } from './contact-response.mapper';
import { CustomerResponse } from './customer.dto';

export function toCustomerResponse(
  customer: Customer,
  options?: { contact: Contact | null },
): CustomerResponse {
  const response: CustomerResponse = {
    id: customer.id,
    companyId: customer.companyId,
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
  };

  if (options) {
    response.contact = options.contact
      ? toContactResponse(options.contact)
      : null;
  }

  return response;
}
