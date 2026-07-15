import { apiClient } from '../../../api/client'
import type { components } from '../../../api/generated/schema'
import type {
  BillingCountryOption,
  CurrencyOption,
  CustomerTypeOption,
  NewCustomerFormValues,
  PaymentTermsOption,
} from '../types'

export type Customer = components['schemas']['CustomerResponse']
export type Contact = components['schemas']['ContactResponse']
export type BillingInformation = components['schemas']['BillingInformationResponse']
export type CreateCustomerRequest = components['schemas']['CreateCustomerRequest']
export type CreateContactRequest = components['schemas']['CreateContactRequest']
export type CreateBillingInformationRequest =
  components['schemas']['CreateBillingInformationRequest']

type CustomerType = CreateCustomerRequest['type']

const customerTypes: Record<CustomerTypeOption, CustomerType> = {
  Company: 'company',
  Individual: 'individual',
  Government: 'government',
}

const countryCodes: Record<
  BillingCountryOption,
  CreateBillingInformationRequest['country']
> = {
  Poland: 'pl',
  Norway: 'no',
}

const currencies: Record<CurrencyOption, CreateBillingInformationRequest['currency']> = {
  'USD ($)': 'usd',
  'EUR (€)': 'eur',
  'PLN (zł)': 'pln',
  'NOK (kr)': 'nok',
}

const paymentTermsInDays: Record<PaymentTermsOption, number> = {
  'Due on receipt': 0,
  'Net 15': 15,
  'Net 30': 30,
  'Net 45': 45,
}

function optionalText(value: string) {
  return value.trim() || undefined
}

function requireData<Data>(data: Data | undefined, response: Response, message: string): Data {
  if (!response.ok || data === undefined) throw new Error(message)
  return data
}

function toCreateCustomerRequest(values: NewCustomerFormValues): CreateCustomerRequest {
  const hasContact = [
    values.contactName,
    values.contactEmail,
    values.contactPhone,
    values.jobTitle,
  ].some((value) => value.trim())
  const hasBillingInformation = [
    values.billingAddress,
    values.billingCity,
    values.billingRegion,
    values.billingPostalCode,
  ].some((value) => value.trim())

  return {
    name: values.customerName.trim(),
    type: customerTypes[values.customerType],
    legalName: optionalText(values.legalCompanyName),
    taxNumber: optionalText(values.taxNumber),
    notes: optionalText(values.internalNotes),
    contact: hasContact
      ? {
          name: values.contactName.trim(),
          email: optionalText(values.contactEmail),
          phone: optionalText(values.contactPhone),
          description: optionalText(values.jobTitle),
        }
      : undefined,
    billingInformation: hasBillingInformation
      ? {
          address: values.billingAddress.trim(),
          city: values.billingCity.trim(),
          region: optionalText(values.billingRegion),
          postalCode: values.billingPostalCode.trim(),
          country: countryCodes[values.billingCountry],
          dueWithinDays: paymentTermsInDays[values.paymentTerms],
          currency: currencies[values.currency],
        }
      : undefined,
  }
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, response } = await apiClient.GET('/api/v1/customers')
  return requireData(data, response, 'Could not load customers.')
}

export async function getCustomer(customerId: string): Promise<Customer> {
  const { data, response } = await apiClient.GET('/api/v1/customers/{customerId}', {
    params: { path: { customerId } },
  })
  return requireData(data, response, 'Could not load the customer.')
}

export async function createCustomer(values: NewCustomerFormValues): Promise<Customer> {
  const { data, response } = await apiClient.POST('/api/v1/customers', {
    body: toCreateCustomerRequest(values),
  })
  return requireData(data, response, 'Could not create the customer.')
}

export async function createContact(
  customerId: string,
  request: CreateContactRequest,
): Promise<Contact> {
  const { data, response } = await apiClient.POST('/api/v1/customers/{customerId}/contact', {
    params: { path: { customerId } },
    body: request,
  })
  return requireData(data, response, 'Could not create the customer contact.')
}

export async function createBillingInformation(
  customerId: string,
  request: CreateBillingInformationRequest,
): Promise<BillingInformation> {
  const { data, response } = await apiClient.POST(
    '/api/v1/customers/{customerId}/billing-information',
    {
      params: { path: { customerId } },
      body: request,
    },
  )
  return requireData(data, response, 'Could not create customer billing information.')
}
