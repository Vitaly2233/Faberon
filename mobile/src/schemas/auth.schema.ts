import { z } from 'zod';

import { env } from '@/constants/env';
import { USER_ROLES } from '@/constants/roles';

const baseLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(env.useMocks ? 6 : 8, `Password must be at least ${env.useMocks ? 6 : 8} characters`),
  rememberMe: z.boolean().optional(),
  companyId: z.string().uuid('Enter a valid company ID').optional(),
  customerId: z.string().uuid('Enter a valid customer ID').optional(),
  role: z.enum(USER_ROLES).optional(),
});

export const loginSchema = baseLoginSchema.superRefine((data, ctx) => {
  if (env.useMocks) {
    return;
  }

  const companyId = data.companyId?.trim() || env.companyId;
  if (!companyId) {
    ctx.addIssue({
      code: 'custom',
      path: ['companyId'],
      message: 'Company ID is required for backend sign-in',
    });
  }

  if (!data.role) {
    ctx.addIssue({
      code: 'custom',
      path: ['role'],
      message: 'Select which portal you are signing in to',
    });
  }
});

export type LoginFormValues = z.infer<typeof baseLoginSchema>;

export const createWorkOrderSchema = z.object({
  assetId: z.string().optional(),
  problemDescription: z.string().min(10, 'Describe the issue in at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  contactPersonName: z.string().min(2, 'Contact person is required'),
  contactPhone: z.string().optional(),
});

export type CreateWorkOrderFormValues = z.infer<typeof createWorkOrderSchema>;

export const estimateChangeSchema = z.object({
  estimatedCompletionDate: z.string().min(1, 'Estimated date is required'),
  reason: z.string().min(3, 'Provide a reason for the estimate change'),
});

export type EstimateChangeFormValues = z.infer<typeof estimateChangeSchema>;
