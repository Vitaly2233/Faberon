import type { CustomerCompany } from '@/types/customer';
import type { UpdateCustomerProfileFormValues } from '@/schemas/profile.schema';

export interface CustomerProfile {
  company: CustomerCompany;
  email: string;
  displayName: string;
}

export interface CustomerService {
  getCurrentCompany(): Promise<CustomerCompany>;
  getProfile(): Promise<CustomerProfile>;
  updateProfile(input: UpdateCustomerProfileFormValues): Promise<CustomerProfile>;
}
