import type { components } from '../../api/generated/schema'
import type { CustomerRecord } from '../../store/customersStore'

type CustomerResponse = components['schemas']['CustomerResponse']

export type Customer = {
  id: string
  name: string
  contactName: string
  contactEmail: string
  billingAddress: string
}

export type CustomerDetail = CustomerRecord

export function toCustomerListItem(customer: CustomerResponse): Customer {
  const addressParts = [customer.address, customer.city, customer.postalCode].filter(
    (part): part is string => Boolean(part),
  )

  return {
    id: customer.id,
    name: customer.name,
    contactName: customer.contact?.name ?? '-',
    contactEmail: customer.contact?.email ?? '-',
    billingAddress: addressParts.length > 0 ? addressParts.join(', ') : '—',
  }
}
