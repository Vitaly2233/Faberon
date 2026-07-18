import { create } from 'zustand'
import { seedCustomers, type CustomerRecord, type CustomerStatus } from './customersSeed'

export type { CustomerRecord, CustomerStatus }

export type NewCustomerInput = {
  name: string
  contactPerson: string
  contactPhone: string
  email: string
  address: string
}

type CustomersStore = {
  customers: CustomerRecord[]
  addCustomer: (input: NewCustomerInput) => string
}

function createCustomerId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `customer-${Date.now()}`
}

export const useCustomersStore = create<CustomersStore>((set) => ({
  customers: seedCustomers,
  addCustomer: (input) => {
    const id = createCustomerId(input.name)
    const record: CustomerRecord = {
      id,
      name: input.name.trim(),
      category: 'Office',
      contactName: input.contactPerson.trim() || '—',
      contactEmail: input.email.trim() || '—',
      locations: 1,
      products: 0,
      attention: 0,
      openOrders: 0,
      contracts: 0,
      unpaid: 0,
      status: 'active',
      legalName: input.name.trim(),
      taxId: '—',
      billingAddress: input.address.trim() || '—',
      phone: input.contactPhone.trim() || '—',
      website: '—',
      accountId: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      accountManager: input.contactPerson.trim() || '—',
    }

    set((state) => ({
      customers: state.customers.some((customer) => customer.id === id)
        ? state.customers.map((customer) => (customer.id === id ? record : customer))
        : [...state.customers, record],
    }))

    return id
  },
}))
