import type { ApiError, ApiErrorCode } from '@/types/api';
import type { NestJsErrorBody } from '@/services/api/backend-types';

function messageFromBody(body: NestJsErrorBody): string {
  if (Array.isArray(body.message)) {
    return body.message.join(', ');
  }
  if (typeof body.message === 'string' && body.message.length > 0) {
    return body.message;
  }
  if (typeof body.error === 'string' && body.error.length > 0) {
    return body.error;
  }
  return 'Request failed';
}

function codeFromStatus(status: number, message: string): ApiErrorCode {
  if (status === 401) {
    return 'UNAUTHORIZED';
  }
  if (status === 403) {
    return 'FORBIDDEN';
  }
  if (status === 404) {
    if (message.toLowerCase().includes('work order')) {
      return 'WORK_ORDER_NOT_FOUND';
    }
    if (message.toLowerCase().includes('customer')) {
      return 'CUSTOMER_NOT_FOUND';
    }
    if (message.toLowerCase().includes('product')) {
      return 'ASSET_NOT_FOUND';
    }
    return 'NOT_FOUND';
  }
  if (status === 400 || status === 409 || status === 422) {
    return 'VALIDATION_ERROR';
  }
  return 'UNKNOWN';
}

export function mapResponseToApiError(status: number, body: unknown): ApiError {
  const payload = (body ?? {}) as NestJsErrorBody & ApiError;
  if (typeof payload.code === 'string' && typeof payload.message === 'string') {
    return {
      code: payload.code as ApiErrorCode,
      message: payload.message,
      details: payload.details,
    };
  }

  const message = messageFromBody(payload);
  return {
    code: codeFromStatus(status, message),
    message,
  };
}
