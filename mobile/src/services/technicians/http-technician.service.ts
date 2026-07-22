import type { AuthService } from '@/services/auth/auth.service';
import type { TechnicianService } from '@/services/technicians/technician.service';
import { createApiError } from '@/services/api/errors';
import type { UpdateTechnicianProfileFormValues } from '@/schemas/technician-profile.schema';

export function createHttpTechnicianService(auth: AuthService): TechnicianService {
  return {
    async getProfile() {
      const session = await auth.getSession();
      if (!session) {
        throw createApiError('UNAUTHORIZED', 'Not authenticated');
      }
      if (session.user.role !== 'TECHNICIAN' && session.user.role !== 'OWNER') {
        throw createApiError('FORBIDDEN', 'Technician profile is not available for this account');
      }

      return {
        id: session.user.id,
        displayName: session.user.displayName,
        email: session.user.email,
      };
    },

    async updateProfile(input: UpdateTechnicianProfileFormValues) {
      const session = await auth.getSession();
      if (!session) {
        throw createApiError('UNAUTHORIZED', 'Not authenticated');
      }

      const nextSession = {
        ...session,
        user: {
          ...session.user,
          displayName: input.displayName,
          email: input.email,
        },
      };
      await auth.saveSession(nextSession);

      return {
        id: nextSession.user.id,
        displayName: input.displayName,
        email: input.email,
        phone: input.phone,
        serviceBaseAddress: input.serviceBaseAddress,
      };
    },
  };
}
