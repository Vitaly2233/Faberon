import type { AuthSession, AuthUser } from '@/types/auth';
import type { LoginFormValues } from '@/schemas/auth.schema';

export interface AuthService {
  login(input: LoginFormValues): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  saveSession(session: AuthSession): Promise<void>;
  clearSession(): Promise<void>;
}

export type { AuthSession, AuthUser };
