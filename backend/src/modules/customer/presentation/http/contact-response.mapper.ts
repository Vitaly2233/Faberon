import type { Contact } from '../../domain/customer';
import { ContactResponse } from './contact.dto';

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    customerId: contact.customerId,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    description: contact.description,
  };
}
