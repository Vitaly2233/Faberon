import { z } from 'zod';

import { parseMoneyStringToMinor } from '@/utils/money';

export const pricingLineItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  internalCost: z.string().min(1, 'Internal cost is required'),
  customerPrice: z.string().min(1, 'Customer price is required'),
  includeInInvoice: z.boolean(),
  informationalOnly: z.boolean(),
});

export type PricingLineItemFormValues = z.infer<typeof pricingLineItemSchema>;

export function pricingFormToMinor(input: PricingLineItemFormValues) {
  return {
    name: input.name,
    quantity: input.quantity,
    internalCostMinor: parseMoneyStringToMinor(input.internalCost),
    customerPriceMinor: parseMoneyStringToMinor(input.customerPrice),
    includeInInvoice: input.includeInInvoice,
    informationalOnly: input.informationalOnly,
  };
}
