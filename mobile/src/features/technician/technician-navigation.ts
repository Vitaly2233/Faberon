import { router, type Href } from 'expo-router';

export function openTechnicianWorkOrder(id: string): void {
  router.push({
    pathname: '/(technician)/work-orders/[id]',
    params: { id },
  } as unknown as Href);
}
