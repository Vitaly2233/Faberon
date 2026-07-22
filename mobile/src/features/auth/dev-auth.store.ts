import { create } from 'zustand';

import type { UserRole } from '@/constants/roles';
import { mockAuthService } from '@/services/auth/mock-auth.service';

interface DevAuthState {
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
}

export const useDevAuthStore = create<DevAuthState>((set) => ({
  devRole: 'CUSTOMER',
  setDevRole: (role) => {
    mockAuthService.setDevRole(role);
    set({ devRole: role });
  },
}));
