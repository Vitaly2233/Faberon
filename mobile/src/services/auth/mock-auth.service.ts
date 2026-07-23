import * as SecureStore from 'expo-secure-store';

import type { UserRole } from '@/constants/roles';
import { mockCustomers } from '@/mocks/seed-data';
import { delay } from '@/mocks/utils';
import type { LoginFormValues } from '@/schemas/auth.schema';
import { authSessionSchema } from '@/schemas/session.schema';
import type { AuthService, AuthSession } from '@/services/auth/auth.service';

const SESSION_KEY = 'faberon.auth.session';

const mockUsers: Record<UserRole, AuthSession['user']> = {
  CUSTOMER: {
    id: 'customer-user-1',
    email: 'j.doe@grandhotel.com',
    displayName: 'John Doe',
    role: 'CUSTOMER',
    tenantId: 'tenant-faberon',
    customerId: mockCustomers[0]?.id,
  },
  TECHNICIAN: {
    id: 'tech-1',
    email: 'mike@faberon.com',
    displayName: 'Mike Andrew',
    role: 'TECHNICIAN',
    tenantId: 'tenant-faberon',
  },
  OWNER: {
    id: 'owner-1',
    email: 'owner@faberon.com',
    displayName: 'Mike Andrew',
    role: 'OWNER',
    tenantId: 'tenant-faberon',
  },
};

function findMockUserByEmail(email: string): AuthSession['user'] | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return Object.values(mockUsers).find((user) => user.email.toLowerCase() === normalizedEmail);
}

export class MockAuthService implements AuthService {
  private memorySession: AuthSession | null = null;
  private activeRole: UserRole = 'CUSTOMER';

  setDevRole(role: UserRole): void {
    this.activeRole = role;
  }

  async login(input: LoginFormValues): Promise<AuthSession> {
    await delay();
    const matchedUser = findMockUserByEmail(input.email);
    const user = matchedUser ?? mockUsers[this.activeRole];
    if (matchedUser) {
      this.activeRole = matchedUser.role;
    }
    const session: AuthSession = {
      accessToken: `mock-token-${user.role.toLowerCase()}`,
      user: {
        ...user,
        email: input.email.trim() || user.email,
      },
    };
    await this.saveSession(session);
    return session;
  }

  async logout(): Promise<void> {
    await delay(150);
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
      const parsed = authSessionSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        await this.clearSession();
        return null;
      }
      this.memorySession = parsed.data;
      return this.memorySession;
    } catch {
      await this.clearSession();
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

export const mockAuthService = new MockAuthService();
