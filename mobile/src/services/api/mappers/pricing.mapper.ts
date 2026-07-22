import type { BackendExtraExpenseResponse } from '@/services/api/backend-types';
import type { PricingLineItem } from '@/types/pricing';
import type { SavePricingLineItemInput } from '@/services/pricing/pricing.service';
import { parseMoneyStringToMinor } from '@/utils/money';

export function mapExtraExpenseToPricingLineItem(
  expense: BackendExtraExpenseResponse,
  index: number,
): PricingLineItem {
  const priceMinor = parseMoneyStringToMinor(expense.price);
  return {
    id: expense.id,
    workOrderId: expense.workOrderId,
    name: expense.name,
    quantity: 1,
    internalCostMinor: priceMinor,
    customerPriceMinor: priceMinor,
    includeInInvoice: !expense.isHidden,
    informationalOnly: false,
    displayOrder: index,
  };
}

export function mapPricingInputToExtraExpenseBody(input: SavePricingLineItemInput): {
  name: string;
  price: string;
  isHidden?: boolean;
} {
  const priceMinor = parseMoneyStringToMinor(input.customerPrice);
  return {
    name: input.name,
    price: (priceMinor / 100).toFixed(2),
    isHidden: !input.includeInInvoice,
  };
}
