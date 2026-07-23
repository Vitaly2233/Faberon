import type { InvoicePreview } from '@/types/invoice';

export interface InvoiceService {
  getPreview(workOrderId: string): Promise<InvoicePreview>;
}
