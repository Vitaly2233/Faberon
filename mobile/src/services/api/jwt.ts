import type { BackendJwtClaims } from '@/services/api/backend-types';

export function decodeJwtPayload(token: string): BackendJwtClaims;
export function decodeJwtPayload<T extends Record<string, unknown>>(token: string): T;
export function decodeJwtPayload<T extends Record<string, unknown>>(token: string): T {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT format');
  }

  const payload = parts[1];
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const decoded = atob(padded);
  return JSON.parse(decoded) as T;
}
