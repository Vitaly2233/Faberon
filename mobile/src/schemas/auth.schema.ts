import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

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
