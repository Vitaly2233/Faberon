export type BackendWorkOrderStage = 'waiting' | 'diagnostics' | 'waiting-parts' | 'repaired';

export type BackendProductOwnership = 'by_client' | 'rented';

export interface BackendLoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface BackendJwtClaims {
  sub: string;
  companyId: string;
  email: string;
}

export interface BackendWorkOrderResponse {
  id: string;
  companyId: string;
  customerId: string;
  productId: string | null;
  workerId: string | null;
  number: number;
  description: string;
  stage: BackendWorkOrderStage;
  createdAt: string;
  estimatedDate: string | null;
  showFinalPrice: boolean;
}

export interface BackendWorkOrderHistoryItem {
  id: string;
  workOrderId: string;
  workerId: string | null;
  text: string;
  createdAt: string;
}

export interface BackendExtraExpenseResponse {
  id: string;
  workOrderId: string;
  name: string;
  price: string;
  isHidden: boolean;
}

export interface BackendCustomerResponse {
  id: string;
  companyId: string;
  name: string;
  type: string;
  legalName: string | null;
  taxNumber: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  notes: string | null;
}

export interface BackendContactResponse {
  id: string;
  customerId: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
}

export interface BackendProductResponse {
  id: string;
  companyId: string;
  customerId: string;
  typeId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  address: string | null;
  contactName: string | null;
  warrantyDate: string | null;
  ownership: BackendProductOwnership;
}

export interface BackendProductCategoryResponse {
  id: string;
  name: string;
}

export interface BackendProductTypeResponse {
  id: string;
  categoryId: string;
  name: string;
}

export interface NestJsErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
