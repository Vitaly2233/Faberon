import { z } from 'zod';

export const updateTechnicianProfileSchema = z.object({
  displayName: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  serviceBaseAddress: z.string().trim().min(5, 'Service base address is required'),
});

export type UpdateTechnicianProfileFormValues = z.infer<typeof updateTechnicianProfileSchema>;
