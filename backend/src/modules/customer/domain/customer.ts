export const CustomerType = {
  Individual: 'individual',
  Company: 'company',
  Government: 'government',
} as const;
export type CustomerType = (typeof CustomerType)[keyof typeof CustomerType];

export const CountryCode = {
  Poland: 'pl',
  Norway: 'no',
} as const;
export type CountryCode = (typeof CountryCode)[keyof typeof CountryCode];

export const CurrencyCode = {
  UsDollar: 'usd',
  PolishZloty: 'pln',
  Euro: 'eur',
  NorwegianKrone: 'nok',
} as const;
export type CurrencyCode = (typeof CurrencyCode)[keyof typeof CurrencyCode];

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  legalName: string | null;
  taxNumber: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: CountryCode | null;
  notes: string | null;
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
}

export interface BillingInformation {
  id: string;
  customerId: string;
  address: string;
  city: string;
  region: string | null;
  postalCode: string;
  country: CountryCode;
  dueWithinDays: number;
  currency: CurrencyCode;
}
