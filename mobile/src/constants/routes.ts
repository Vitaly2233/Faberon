import type { Href } from 'expo-router';

export const routes = {
  customer: {
    workOrders: '/work-orders' as Href,
    workOrderCreate: '/work-orders/create' as Href,
    workOrderCreateWithAsset: (assetId: string) =>
      ({
        pathname: '/work-orders/create',
        params: { assetId },
      }) as const,
    workOrderDetail: (id: string) =>
      ({
        pathname: '/work-orders/[id]',
        params: { id },
      }) as const,
    workOrderEdit: (id: string) =>
      ({
        pathname: '/work-orders/edit',
        params: { id },
      }) as const,
    workOrderInvoice: (id: string) =>
      ({
        pathname: '/work-orders/invoice',
        params: { id },
      }) as const,
    notifications: '/(customer)/notifications' as Href,
    assetCreate: '/assets/create' as Href,
    assetDetail: (id: string) =>
      ({
        pathname: '/assets/[id]',
        params: { id },
      }) as const,
    profileSettings: '/profile/settings' as Href,
  },
} as const;
