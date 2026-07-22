import type { ApiError, ApiErrorCode } from '@/types/api';

export class ApiRequestError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiRequestError';
    this.code = error.code;
    this.details = error.details;
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export function createApiError(code: ApiErrorCode, message: string): ApiRequestError {
  return new ApiRequestError({ code, message });
}
