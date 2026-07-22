import { z } from 'zod';

import { createAssetSchema } from '@/schemas/asset.schema';

export const createCustomerWorkOrderSchema = z.object({
  assetId: z.string().optional(),
  newAsset: createAssetSchema.optional(),
  problemDescription: z.string().min(10, 'Describe the issue in at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  contactPersonName: z.string().min(2, 'Contact person is required'),
  contactPhone: z.string().optional(),
});

export type CreateCustomerWorkOrderFormValues = z.infer<typeof createCustomerWorkOrderSchema>;

export const updateCustomerWorkOrderSchema = z.object({
  problemDescription: z.string().min(10, 'Describe the issue in at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  contactPersonName: z.string().min(2, 'Contact person is required'),
  contactPhone: z.string().optional(),
});

export type UpdateCustomerWorkOrderFormValues = z.infer<typeof updateCustomerWorkOrderSchema>;

export const workOrderCommentSchema = z.object({
  message: z.string().min(3, 'Comment must be at least 3 characters'),
  customerVisible: z.boolean(),
});

export type WorkOrderCommentFormValues = z.infer<typeof workOrderCommentSchema>;
