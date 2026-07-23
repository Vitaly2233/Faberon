import { create } from 'zustand';

import type { UserRole } from '@/constants/roles';
import { env } from '@/constants/env';
import { httpAuthService } from '@/services/auth/http-auth.service';
import { mockAuthService } from '@/services/auth/mock-auth.service';

interface DevAuthState {
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
}

function setAuthRole(role: UserRole): void {
  if (env.useMocks) {
    mockAuthService.setDevRole(role);
    return;
  }
  httpAuthService.setLoginRole(role);
}

export const useDevAuthStore = create<DevAuthState>((set) => ({
  devRole: 'CUSTOMER',
  setDevRole: (role) => {
    setAuthRole(role);
    set({ devRole: role });
  },
}));
