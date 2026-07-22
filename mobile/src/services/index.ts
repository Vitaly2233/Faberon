import { env } from '@/constants/env';
import { createHttpAssetService } from '@/services/assets/http-asset.service';
import { mockAssetService } from '@/services/assets/mock-asset.service';
import { httpAuthService } from '@/services/auth/http-auth.service';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { createHttpCustomerService } from '@/services/customers/http-customer.service';
import { mockCustomerService } from '@/services/customers/mock-customer.service';
import { createHttpInvoiceService } from '@/services/invoices/http-invoice.service';
import { mockInvoiceService } from '@/services/invoices/mock-invoice.service';
import { createHttpNotificationService } from '@/services/notifications/http-notification.service';
import { mockNotificationService } from '@/services/notifications/mock-notification.service';
import { createHttpPricingService } from '@/services/pricing/http-pricing.service';
import { mockPricingService } from '@/services/pricing/mock-pricing.service';
import { createHttpTechnicianService } from '@/services/technicians/http-technician.service';
import { mockTechnicianService } from '@/services/technicians/mock-technician.service';
import { createHttpWorkOrderService } from '@/services/work-orders/http-work-order.service';
import { mockWorkOrderService } from '@/services/work-orders/mock-work-order.service';

const auth = env.useMocks ? mockAuthService : httpAuthService;

const sharedServices = {
  auth,
  assets: env.useMocks ? mockAssetService : createHttpAssetService(auth),
  notifications: env.useMocks ? mockNotificationService : createHttpNotificationService(),
  customers: env.useMocks ? mockCustomerService : createHttpCustomerService(auth),
  invoices: env.useMocks ? mockInvoiceService : createHttpInvoiceService(auth),
  technicians: env.useMocks ? mockTechnicianService : createHttpTechnicianService(auth),
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
