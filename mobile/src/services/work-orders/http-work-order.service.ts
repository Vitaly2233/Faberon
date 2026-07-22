import { apiRequest } from '@/services/api/client';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { EstimateChangeFormValues } from '@/schemas/auth.schema';
import type {
  CreateCustomerWorkOrderFormValues,
  UpdateCustomerWorkOrderFormValues,
  WorkOrderCommentFormValues,
} from '@/schemas/work-order.schema';
import type { AuthService } from '@/services/auth/auth.service';
import type { WorkOrderService } from '@/services/work-orders/work-order.service';
import type { WorkOrder } from '@/types/work-order';

export function createHttpWorkOrderService(auth: AuthService): WorkOrderService {
  const withToken = createWithAccessToken(auth);

  return {
    listForCurrentUser() {
      return withToken((token) => apiRequest<WorkOrder[]>('/work-orders', { token }));
    },

    getById(id: string) {
      return withToken((token) => apiRequest<WorkOrder>(`/work-orders/${id}`, { token }));
    },

    create(input: CreateCustomerWorkOrderFormValues) {
      return withToken((token) =>
        apiRequest<WorkOrder>('/work-orders', { method: 'POST', token, body: input }),
      );
    },

    listAvailableForTechnician() {
      return withToken((token) => apiRequest<WorkOrder[]>('/work-orders?available=true', { token }));
    },

    assignToSelf(id: string) {
      return withToken((token) =>
        apiRequest<WorkOrder>(`/work-orders/${id}/assign`, { method: 'POST', token }),
      );
    },

    advanceStage(id: string) {
      return withToken((token) =>
        apiRequest<WorkOrder>(`/work-orders/${id}/stage`, { method: 'POST', token }),
      );
    },

    updateEstimate(id: string, input: EstimateChangeFormValues) {
      return withToken((token) =>
        apiRequest<WorkOrder>(`/work-orders/${id}/estimate`, { method: 'POST', token, body: input }),
      );
    },

    addComment(id: string, input: WorkOrderCommentFormValues) {
      return withToken((token) =>
        apiRequest<WorkOrder>(`/work-orders/${id}/comments`, { method: 'POST', token, body: input }),
      );
    },

    updateCustomer(id: string, input: UpdateCustomerWorkOrderFormValues) {
      return withToken((token) =>
        apiRequest<WorkOrder>(`/work-orders/${id}`, { method: 'PATCH', token, body: input }),
      );
    },
  };
}
