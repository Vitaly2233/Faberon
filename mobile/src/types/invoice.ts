import type { InvoiceDisplayMode } from '@/types/pricing';
import type { MoneyMinor } from '@/types/money';

export interface InvoiceLineItem {
  id: string;
  name: string;
  quantity: number;
  unitPriceMinor: MoneyMinor;
  lineTotalMinor: MoneyMinor;
}

export interface ServiceProviderInfo {
  name: string;
  address: string;
  logoUrl?: string | null;
}

export interface InvoiceBillTo {
  companyName: string;
  address: string;
}

export interface InvoicePreview {
  workOrderId: string;
  workOrderNumber: number;
  issuedAt: string;
  displayMode: InvoiceDisplayMode;
  provider: ServiceProviderInfo;
  billTo: InvoiceBillTo;
  lineItems: InvoiceLineItem[];
  totalMinor: MoneyMinor;
  currency: string;
}
