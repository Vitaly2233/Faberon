import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import { services } from '@/services';

export function useInvoicePreviewQuery(workOrderId: string) {
  return useQuery({
    queryKey: queryKeys.invoice(workOrderId),
    queryFn: () => services.invoices.getPreview(workOrderId),
    enabled: Boolean(workOrderId),
  });
}
