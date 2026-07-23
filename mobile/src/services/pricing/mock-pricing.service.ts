import { createApiError } from '@/services/api/errors';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { mockPricingLineItems } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import type { SavePricingLineItemInput, PricingService } from '@/services/pricing/pricing.service';
import { pricingFormToMinor } from '@/schemas/pricing.schema';

let lineItems = clone(mockPricingLineItems);

export class MockPricingService implements PricingService {
  async listForWorkOrder(workOrderId: string) {
    await delay();
    return clone(
      lineItems
        .filter((item) => item.workOrderId === workOrderId)
        .sort((left, right) => left.displayOrder - right.displayOrder),
    );
  }

  async saveLineItem(workOrderId: string, input: SavePricingLineItemInput) {
    await delay(200);
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can edit pricing');
    }

    const payload = pricingFormToMinor(input);
    const existingIndex = input.id ? lineItems.findIndex((item) => item.id === input.id) : -1;
    const displayOrder =
      existingIndex >= 0
        ? lineItems[existingIndex]!.displayOrder
        : lineItems.filter((item) => item.workOrderId === workOrderId).length + 1;

    const saved = {
      id: input.id ?? `price-${Date.now()}`,
      workOrderId,
      name: payload.name,
      quantity: payload.quantity,
      internalCostMinor: payload.internalCostMinor,
      customerPriceMinor: payload.customerPriceMinor,
      includeInInvoice: payload.includeInInvoice,
      informationalOnly: payload.informationalOnly,
      displayOrder,
    };

    if (existingIndex >= 0) {
      lineItems[existingIndex] = saved;
    } else {
      lineItems = [...lineItems, saved];
    }

    return clone(saved);
  }

  async deleteLineItem(workOrderId: string, lineItemId: string) {
    await delay(150);
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can edit pricing');
    }

    lineItems = lineItems.filter(
      (item) => !(item.workOrderId === workOrderId && item.id === lineItemId),
    );
  }
}

export const mockPricingService = new MockPricingService();
