import { createApiError } from '@/services/api/errors';
import type { AuthService } from '@/services/auth/auth.service';

export function createWithAccessToken(auth: AuthService) {
  return async function withAccessToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
    const session = await auth.getSession();
    if (!session?.accessToken) {
      throw createApiError('UNAUTHORIZED', 'Not authenticated');
    }
    return fn(session.accessToken);
  };
}
