import type { PricingLineItem } from '@/types/pricing';
import type { PricingLineItemFormValues } from '@/schemas/pricing.schema';

export interface SavePricingLineItemInput extends Omit<PricingLineItemFormValues, 'id'> {
  id?: string;
}

export interface PricingService {
  listForWorkOrder(workOrderId: string): Promise<PricingLineItem[]>;
  saveLineItem(workOrderId: string, input: SavePricingLineItemInput): Promise<PricingLineItem>;
  deleteLineItem(workOrderId: string, lineItemId: string): Promise<void>;
}
