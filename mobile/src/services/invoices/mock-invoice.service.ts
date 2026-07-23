import { createApiError } from '@/services/api/errors';
import { mockCompany } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import { mockPricingService } from '@/services/pricing/mock-pricing.service';
import { mockWorkOrderService } from '@/services/work-orders/mock-work-order.service';
import type { InvoiceService } from '@/services/invoices/invoice.service';
import { canCustomerViewInvoice } from '@/utils/permissions';
import {
  calculateInvoiceTotalMinor,
  getCustomerInvoiceLineItems,
} from '@/utils/invoice';
import { multiplyMoneyMinor } from '@/utils/money';
import { nowIso } from '@/utils/dates';

export class MockInvoiceService implements InvoiceService {
  async getPreview(workOrderId: string) {
    await delay();
    const order = await mockWorkOrderService.getById(workOrderId);
    if (!order) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }
    if (!canCustomerViewInvoice(order)) {
      throw createApiError('INVOICE_NOT_AVAILABLE', 'Invoice is not available for this work order yet');
    }

    const pricingItems = await mockPricingService.listForWorkOrder(workOrderId);
    const billableItems = getCustomerInvoiceLineItems(pricingItems);

    return clone({
      workOrderId: order.id,
      workOrderNumber: order.number,
      issuedAt: order.updatedAt ?? nowIso(),
      displayMode: order.invoiceDisplayMode,
      provider: {
        name: mockCompany.name,
        address: mockCompany.address,
        logoUrl: mockCompany.logoUrl,
      },
      billTo: {
        companyName: order.customerName,
        address: order.address,
      },
      lineItems: billableItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPriceMinor: item.customerPriceMinor,
        lineTotalMinor: multiplyMoneyMinor(item.customerPriceMinor, item.quantity),
      })),
      totalMinor: calculateInvoiceTotalMinor(pricingItems),
      currency: 'PLN',
    });
  }
}

export const mockInvoiceService = new MockInvoiceService();
