import type { InvoiceDisplayMode, PricingLineItem } from '@/types/pricing';
import type { MoneyMinor } from '@/types/money';
import { multiplyMoneyMinor, sumMoneyMinor } from '@/utils/money';

export function getCustomerInvoiceLineItems(items: PricingLineItem[]): PricingLineItem[] {
  return items.filter((item) => item.includeInInvoice && !item.informationalOnly);
}

export function calculateInvoiceTotalMinor(items: PricingLineItem[]): MoneyMinor {
  return sumMoneyMinor(
    getCustomerInvoiceLineItems(items).map(
      (item) => multiplyMoneyMinor(item.customerPriceMinor, item.quantity),
    ),
  );
}

export function shouldShowItemizedInvoice(displayMode: InvoiceDisplayMode): boolean {
  return displayMode === 'ITEMIZED';
}
