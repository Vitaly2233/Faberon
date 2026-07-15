import type { NewCustomerFormValues } from '../types'

export const initialNewCustomerValues: NewCustomerFormValues = {
  customerType: 'Company',
  customerName: '',
  legalCompanyName: '',
  taxNumber: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  jobTitle: '',
  billingAddress: '',
  billingCity: '',
  billingRegion: '',
  billingPostalCode: '',
  billingCountry: 'Poland',
  paymentTerms: 'Net 30',
  currency: 'USD ($)',
  internalNotes: '',
}
