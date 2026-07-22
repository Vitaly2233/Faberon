import type { TechnicianProfile } from '@/types/technician';
import type { UpdateTechnicianProfileFormValues } from '@/schemas/technician-profile.schema';

export interface TechnicianService {
  getProfile(): Promise<TechnicianProfile>;
  updateProfile(input: UpdateTechnicianProfileFormValues): Promise<TechnicianProfile>;
}
