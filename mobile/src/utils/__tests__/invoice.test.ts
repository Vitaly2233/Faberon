import type { PricingLineItem } from '@/types/pricing';
import {
  calculateInvoiceTotalMinor,
  getCustomerInvoiceLineItems,
  shouldShowItemizedInvoice,
} from '@/utils/invoice';

const sampleItems: PricingLineItem[] = [
  {
    id: 'p1',
    workOrderId: 'wo-1',
    name: 'Part A',
    quantity: 2,
    internalCostMinor: 5000,
    customerPriceMinor: 7000,
    includeInInvoice: true,
    informationalOnly: false,
    displayOrder: 1,
  },
  {
    id: 'p2',
    workOrderId: 'wo-1',
    name: 'Internal diagnostic',
    quantity: 1,
    internalCostMinor: 3000,
    customerPriceMinor: 0,
    includeInInvoice: false,
    informationalOnly: true,
    displayOrder: 2,
  },
  {
    id: 'p3',
    workOrderId: 'wo-1',
    name: 'Hidden fee',
    quantity: 1,
    internalCostMinor: 1000,
    customerPriceMinor: 1500,
    includeInInvoice: false,
    informationalOnly: false,
    displayOrder: 3,
  },
];

describe('invoice utils', () => {
  it('filters billable customer line items', () => {
    expect(getCustomerInvoiceLineItems(sampleItems)).toHaveLength(1);
    expect(getCustomerInvoiceLineItems(sampleItems)[0]?.name).toBe('Part A');
  });

  it('calculates invoice total from billable items', () => {
    expect(calculateInvoiceTotalMinor(sampleItems)).toBe(14000);
  });

  it('respects invoice display mode', () => {
    expect(shouldShowItemizedInvoice('ITEMIZED')).toBe(true);
    expect(shouldShowItemizedInvoice('TOTAL_ONLY')).toBe(false);
  });
});
