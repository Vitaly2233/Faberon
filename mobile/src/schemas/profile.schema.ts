import { z } from 'zod';

export const updateCustomerProfileSchema = z.object({
  contactPersonName: z.string().trim().min(2, 'Contact name is required'),
  companyName: z.string().trim().min(2, 'Company name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  defaultAddress: z.string().trim().min(5, 'Default address is required'),
});

export type UpdateCustomerProfileFormValues = z.infer<typeof updateCustomerProfileSchema>;
