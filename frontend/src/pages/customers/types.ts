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

export type NewCustomerFormValues = {
  customerType: string
  customerName: string
  legalCompanyName: string
  taxNumber: string
  contactName: string
  contactEmail: string
  contactPhone: string
  jobTitle: string
  billingAddress: string
  billingCity: string
  billingRegion: string
  billingPostalCode: string
  billingCountry: string
  paymentTerms: string
  currency: string
  locationName: string
  locationAddress: string
  locationCity: string
  locationRegion: string
  locationPostalCode: string
  locationCountry: string
  locationContactName: string
  locationPhone: string
  locationEmail: string
  portalEnabled: boolean
  sendInvitation: boolean
  internalNotes: string
}

export type NewCustomerField = keyof NewCustomerFormValues

export type NewCustomerFormStep = 0 | 1 | 2
