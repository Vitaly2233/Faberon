import type { CountryCode, CustomerType } from '../domain/customer';

export interface CreateCustomerInput {
  name: string;
  type?: CustomerType;
  legalName?: string | null;
  taxNumber?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: CountryCode | null;
  notes?: string | null;
}
