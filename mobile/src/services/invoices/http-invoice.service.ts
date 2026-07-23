import { apiRequest } from '@/services/api/client';
import type { BackendCustomerResponse } from '@/services/api/backend-types';
import { createApiError } from '@/services/api/errors';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { AuthService } from '@/services/auth/auth.service';
import type { InvoiceService } from '@/services/invoices/invoice.service';
import { createHttpPricingService } from '@/services/pricing/http-pricing.service';
import { createHttpWorkOrderService } from '@/services/work-orders/http-work-order.service';
import { canCustomerViewInvoice } from '@/utils/permissions';
import {
  calculateInvoiceTotalMinor,
  getCustomerInvoiceLineItems,
} from '@/utils/invoice';
import { multiplyMoneyMinor } from '@/utils/money';
import { nowIso } from '@/utils/dates';

export function createHttpInvoiceService(auth: AuthService): InvoiceService {
  const withToken = createWithAccessToken(auth);
  const workOrders = createHttpWorkOrderService(auth);
  const pricing = createHttpPricingService(auth);

  return {
    getPreview(workOrderId) {
      return withToken(async (token) => {
        const order = await workOrders.getById(workOrderId);
        if (!canCustomerViewInvoice(order)) {
          throw createApiError(
            'INVOICE_NOT_AVAILABLE',
            'Invoice is not available for this work order yet',
          );
        }

        const [pricingItems, customer] = await Promise.all([
          pricing.listForWorkOrder(workOrderId),
          apiRequest<BackendCustomerResponse>(`/customers/${order.customerId}`, { token }).catch(
            () => null,
          ),
        ]);

        const billableItems = getCustomerInvoiceLineItems(pricingItems);

        return {
          workOrderId: order.id,
          workOrderNumber: order.number,
          issuedAt: order.updatedAt ?? nowIso(),
          displayMode: order.invoiceDisplayMode,
          provider: {
            name: 'Faberon Service',
            address: 'Service company address',
          },
          billTo: {
            companyName: customer?.name ?? order.customerName,
            address: customer?.address ?? order.address,
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
        };
      });
    },
  };
}
