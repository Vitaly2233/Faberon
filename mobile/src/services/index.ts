import { env } from '@/constants/env';
import { mockAssetService } from '@/services/assets/mock-asset.service';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { mockCustomerService } from '@/services/customers/mock-customer.service';
import { mockInvoiceService } from '@/services/invoices/mock-invoice.service';
import { mockNotificationService } from '@/services/notifications/mock-notification.service';
import { createHttpPricingService } from '@/services/pricing/http-pricing.service';
import { mockPricingService } from '@/services/pricing/mock-pricing.service';
import { mockTechnicianService } from '@/services/technicians/mock-technician.service';
import { createHttpWorkOrderService } from '@/services/work-orders/http-work-order.service';
import { mockWorkOrderService } from '@/services/work-orders/mock-work-order.service';

const auth = mockAuthService;

const sharedServices = {
  auth,
  assets: mockAssetService,
  notifications: mockNotificationService,
  customers: mockCustomerService,
  invoices: mockInvoiceService,
  technicians: mockTechnicianService,
} as const;

export const services = env.useMocks
  ? {
      ...sharedServices,
      workOrders: mockWorkOrderService,
      pricing: mockPricingService,
    }
  : {
      ...sharedServices,
      workOrders: createHttpWorkOrderService(auth),
      pricing: createHttpPricingService(auth),
    };

export type AppServices = typeof services;
