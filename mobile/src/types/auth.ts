import type { UserRole } from '@/constants/roles';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  tenantId: string;
  customerId?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}
