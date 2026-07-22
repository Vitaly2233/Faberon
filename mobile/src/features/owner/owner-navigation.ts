import { router, type Href } from 'expo-router';

export function openOwnerWorkOrder(id: string): void {
  router.push({
    pathname: '/(owner)/work-orders/[id]',
    params: { id },
  } as unknown as Href);
}
