export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  position?: string;
  isDefault: boolean;
}

export interface CustomerCompany {
  id: string;
  tenantId: string;
  companyName: string;
  defaultAddress: string;
  defaultContactId?: string;
  contacts: Contact[];
}

export type { CommentVisibility } from './work-order';
