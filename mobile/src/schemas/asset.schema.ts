import { z } from 'zod';

export const createAssetSchema = z.object({
  assetType: z.string().min(1, 'Type is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  primaryContactName: z.string().optional(),
  ownershipType: z.enum(['CUSTOMER_OWNED', 'LEASED']),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
