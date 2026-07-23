import * as SecureStore from 'expo-secure-store';

import { env } from '@/constants/env';
import type { UserRole } from '@/constants/roles';
import type { LoginFormValues } from '@/schemas/auth.schema';
import { authSessionSchema } from '@/schemas/session.schema';
import { apiRequest } from '@/services/api/client';
import type { BackendCustomerResponse, BackendLoginResponse } from '@/services/api/backend-types';
import { decodeJwtPayload } from '@/services/api/jwt';
import type { AuthService, AuthSession } from '@/services/auth/auth.service';

const SESSION_KEY = 'faberon.auth.session';

async function resolveCustomerId(
  token: string,
  email: string,
  explicitCustomerId?: string,
): Promise<string | undefined> {
  if (explicitCustomerId) {
    return explicitCustomerId;
  }
  if (env.customerId) {
    return env.customerId;
  }

  try {
    const customers = await apiRequest<BackendCustomerResponse[]>('/customers', { token });
    const normalizedEmail = email.trim().toLowerCase();
    for (const customer of customers) {
      try {
        const contact = await apiRequest<{ email: string | null }>(`/customers/${customer.id}/contact`, {
          token,
        });
        if (contact.email?.toLowerCase() === normalizedEmail) {
          return customer.id;
        }
      } catch {
        // Customer may not have a contact yet.
      }
    }
    return customers[0]?.id;
  } catch {
    return undefined;
  }
}

function displayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? email;
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export class HttpAuthService implements AuthService {
  private memorySession: AuthSession | null = null;
  private loginRole: UserRole = 'TECHNICIAN';

  setLoginRole(role: UserRole): void {
    this.loginRole = role;
  }

  async login(input: LoginFormValues): Promise<AuthSession> {
    const companyId = input.companyId?.trim() || env.companyId;
    if (!companyId) {
      throw new Error('Company ID is required to sign in against the backend API');
    }

    const role = input.role ?? this.loginRole;
    const loginResponse = await apiRequest<BackendLoginResponse>('/auth/login', {
      method: 'POST',
      body: {
        companyId,
        email: input.email.trim(),
        password: input.password,
      },
    });

    const claims = decodeJwtPayload(loginResponse.accessToken);
    const customerId =
      role === 'CUSTOMER'
        ? await resolveCustomerId(loginResponse.accessToken, claims.email, input.customerId)
        : undefined;

    const session: AuthSession = {
      accessToken: loginResponse.accessToken,
      user: {
        id: claims.sub,
        email: claims.email,
        displayName: displayNameFromEmail(claims.email),
        role,
        tenantId: claims.companyId,
        customerId,
      },
    };

    await this.saveSession(session);
    return session;
  }

  async logout(): Promise<void> {
    await this.clearSession();
  }

  async getSession(): Promise<AuthSession | null> {
    if (this.memorySession) {
      return this.memorySession;
    }

    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = authSessionSchema.parse(JSON.parse(raw));
      this.memorySession = parsed;
      return parsed;
    } catch {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return null;
    }
  }

  async saveSession(session: AuthSession): Promise<void> {
    this.memorySession = session;
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }

  async clearSession(): Promise<void> {
    this.memorySession = null;
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export const httpAuthService = new HttpAuthService();
