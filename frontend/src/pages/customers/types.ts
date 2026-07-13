export type CustomerStatus = 'active' | 'inactive'

export type Customer = {
  id: string
  name: string
  category: string
  contactName: string
  contactEmail: string
  locations: number
  products: number
  attention: number
  openOrders: number
  contracts: number
  unpaid: number
  status: CustomerStatus
}

export type CustomerDetail = Customer & {
  legalName: string
  taxId: string
  billingAddress: string
  phone: string
  website: string
  accountId: string
  accountManager: string
}
