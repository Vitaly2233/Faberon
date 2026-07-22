import { env } from '@/constants/env';
import { notifyUnauthorized } from '@/services/api/unauthorized';
import { ApiRequestError } from '@/services/api/errors';
import type { ApiError } from '@/types/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let payload: ApiError | undefined;
    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = {
        code: response.status === 401 ? 'UNAUTHORIZED' : 'UNKNOWN',
        message: `Request failed with status ${response.status}`,
      };
    }

    if (response.status === 401 || payload.code === 'UNAUTHORIZED') {
      await notifyUnauthorized();
    }

    throw new ApiRequestError(payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
