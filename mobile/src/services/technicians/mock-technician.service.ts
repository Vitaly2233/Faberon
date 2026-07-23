import { createApiError } from '@/services/api/errors';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { clone, delay } from '@/mocks/utils';
import type { TechnicianService } from '@/services/technicians/technician.service';
import type { UpdateTechnicianProfileFormValues } from '@/schemas/technician-profile.schema';
import type { TechnicianProfile } from '@/types/technician';

const STAFF_ROLES = new Set(['TECHNICIAN', 'OWNER']);

const defaultProfiles: Record<string, TechnicianProfile> = {
  'tech-1': {
    id: 'tech-1',
    displayName: 'Mike Andrew',
    email: 'mike@faberon.com',
    phone: '+1 (555) 010-2201',
    serviceBaseAddress: '102 Ocean Blvd, Miami, FL 33101',
  },
  'tech-2': {
    id: 'tech-2',
    displayName: 'Dana Cruz',
    email: 'dana@faberon.com',
    phone: '+1 (555) 010-2202',
    serviceBaseAddress: '102 Ocean Blvd, Miami, FL 33101',
  },
  'owner-1': {
    id: 'owner-1',
    displayName: 'Mike Andrew',
    email: 'owner@faberon.com',
    phone: '+1 (555) 010-1100',
    serviceBaseAddress: '102 Ocean Blvd, Miami, FL 33101',
  },
};

let profiles = clone(defaultProfiles);

export class MockTechnicianService implements TechnicianService {
  async getProfile() {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session || !STAFF_ROLES.has(session.user.role)) {
      throw createApiError('FORBIDDEN', 'Staff profile is not available');
    }

    const profile = profiles[session.user.id] ?? {
      id: session.user.id,
      displayName: session.user.displayName,
      email: session.user.email,
      phone: '',
      serviceBaseAddress: '',
    };

    return clone(profile);
  }

  async updateProfile(input: UpdateTechnicianProfileFormValues) {
    await delay(200);
    const session = await mockAuthService.getSession();
    if (!session || !STAFF_ROLES.has(session.user.role)) {
      throw createApiError('FORBIDDEN', 'Staff profile is not available');
    }

    const updated: TechnicianProfile = {
      id: session.user.id,
      displayName: input.displayName,
      email: input.email,
      phone: input.phone || undefined,
      serviceBaseAddress: input.serviceBaseAddress,
    };

    profiles = {
      ...profiles,
      [session.user.id]: updated,
    };

    await mockAuthService.saveSession({
      ...session,
      user: {
        ...session.user,
        displayName: updated.displayName,
        email: updated.email,
      },
    });

    return clone(updated);
  }
}

export const mockTechnicianService = new MockTechnicianService();
