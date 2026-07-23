import { z } from 'zod';

import { USER_ROLES } from '@/constants/roles';

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  role: z.enum(USER_ROLES),
  tenantId: z.string().min(1),
  customerId: z.string().optional(),
});

export const authSessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  user: authUserSchema,
});

export type ParsedAuthSession = z.infer<typeof authSessionSchema>;
