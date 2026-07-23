export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'WORK_ORDER_NOT_FOUND'
  | 'INVOICE_NOT_AVAILABLE'
  | 'ASSET_NOT_FOUND'
  | 'CUSTOMER_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
