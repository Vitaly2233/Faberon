export const queryKeys = {
  session: ['session'] as const,
  workOrders: ['workOrders'] as const,
  workOrder: (id: string) => ['workOrders', id] as const,
  availableWorkOrders: ['workOrders', 'available'] as const,
  assets: ['assets'] as const,
  asset: (id: string) => ['assets', id] as const,
  notifications: ['notifications'] as const,
  customerCompany: ['customerCompany'] as const,
  customerProfile: ['customerProfile'] as const,
  technicianProfile: ['technicianProfile'] as const,
  pricing: (workOrderId: string) => ['pricing', workOrderId] as const,
  invoice: (workOrderId: string) => ['invoice', workOrderId] as const,
};
