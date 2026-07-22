import type { MoneyMinor } from './money';

export type InvoiceDisplayMode = 'ITEMIZED' | 'TOTAL_ONLY';

export interface PricingLineItem {
  id: string;
  workOrderId: string;
  name: string;
  description?: string;
  quantity: number;
  internalCostMinor: MoneyMinor;
  customerPriceMinor: MoneyMinor;
  includeInInvoice: boolean;
  informationalOnly: boolean;
  displayOrder: number;
}
