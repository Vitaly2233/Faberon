export type CustomerStatus = 'active' | 'inactive'
export type CustomerTypeOption = 'Company' | 'Individual' | 'Government'
export type BillingCountryOption = 'Poland' | 'Norway'
export type PaymentTermsOption = 'Due on receipt' | 'Net 15' | 'Net 30' | 'Net 45'
export type CurrencyOption = 'USD ($)' | 'EUR (€)' | 'PLN (zł)' | 'NOK (kr)'

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
  customerType: CustomerTypeOption
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
  billingCountry: BillingCountryOption
  paymentTerms: PaymentTermsOption
  currency: CurrencyOption
  internalNotes: string
}

export type NewCustomerField = keyof NewCustomerFormValues

export type NewCustomerFormStep = 0 | 1 | 2
