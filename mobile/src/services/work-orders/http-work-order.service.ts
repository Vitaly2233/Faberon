import { env } from '@/constants/env';
import { apiRequest } from '@/services/api/client';
import type {
  BackendContactResponse,
  BackendCustomerResponse,
  BackendProductCategoryResponse,
  BackendProductResponse,
  BackendProductTypeResponse,
  BackendWorkOrderHistoryItem,
  BackendWorkOrderResponse,
} from '@/services/api/backend-types';
import {
  mapCustomerToWorkOrderContext,
  mapWorkOrderFromBackend,
  mapWorkflowStageToBackendStage,
} from '@/services/api/mappers/work-order.mapper';
import { mapAssetOwnershipToBackend } from '@/services/api/mappers/product.mapper';
import { createApiError } from '@/services/api/errors';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { CreateAssetFormValues } from '@/schemas/asset.schema';
import type { AuthService } from '@/services/auth/auth.service';
import type { WorkOrderService } from '@/services/work-orders/work-order.service';
import type { AuthUser } from '@/types/auth';
import type { WorkOrder } from '@/types/work-order';
import { getNextWorkflowStage } from '@/utils/work-orders';

let cachedDefaultProductTypeId: string | null = null;

async function resolveDefaultProductTypeId(token: string): Promise<string> {
  if (env.defaultProductTypeId) {
    return env.defaultProductTypeId;
  }
  if (cachedDefaultProductTypeId) {
    return cachedDefaultProductTypeId;
  }

  const categories = await apiRequest<BackendProductCategoryResponse[]>('/product-categories', {
    token,
  });
  const firstCategory = categories[0];
  if (!firstCategory) {
    throw createApiError('VALIDATION_ERROR', 'No product categories are configured on the server');
  }

  const types = await apiRequest<BackendProductTypeResponse[]>(
    `/product-categories/${firstCategory.id}/types`,
    { token },
  );
  const firstType = types[0];
  if (!firstType) {
    throw createApiError('VALIDATION_ERROR', 'No product types are configured on the server');
  }

  cachedDefaultProductTypeId = firstType.id;
  return firstType.id;
}

async function fetchCustomerContext(
  token: string,
  customerId: string,
): Promise<ReturnType<typeof mapCustomerToWorkOrderContext>> {
  try {
    const customer = await apiRequest<BackendCustomerResponse>(`/customers/${customerId}`, { token });
    let contact: BackendContactResponse | null = null;
    try {
      contact = await apiRequest<BackendContactResponse>(`/customers/${customerId}/contact`, { token });
    } catch {
      contact = null;
    }
    return mapCustomerToWorkOrderContext(customer, contact);
  } catch {
    return { customerName: 'Customer', address: '' };
  }
}

async function mapOrder(
  order: BackendWorkOrderResponse,
  token: string,
  history: BackendWorkOrderHistoryItem[] = [],
  sessionUser?: AuthUser | null,
): Promise<WorkOrder> {
  const customerContext = await fetchCustomerContext(token, order.customerId);
  return mapWorkOrderFromBackend(order, {
    ...customerContext,
    history,
    sessionUser: sessionUser ?? null,
  });
}

async function fetchOrderById(
  auth: AuthService,
  token: string,
  id: string,
): Promise<WorkOrder> {
  const session = await auth.getSession();
  const [order, history] = await Promise.all([
    apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, { token }),
    apiRequest<BackendWorkOrderHistoryItem[]>(`/work-orders/${id}/history`, { token }),
  ]);
  return mapOrder(order, token, history, session?.user);
}

async function createProductFromAssetInput(
  token: string,
  customerId: string,
  input: CreateAssetFormValues,
): Promise<string> {
  const typeId = await resolveDefaultProductTypeId(token);
  const product = await apiRequest<BackendProductResponse>('/products', {
    method: 'POST',
    token,
    body: {
      customerId,
      typeId,
      manufacturer: input.manufacturer,
      model: input.model,
      serialNumber: input.serialNumber?.trim() || `SN-${Date.now()}`,
      ownership: mapAssetOwnershipToBackend(input.ownershipType),
      address: input.address ?? null,
      contactName: input.primaryContactName ?? null,
    },
  });
  return product.id;
}

export function createHttpWorkOrderService(auth: AuthService): WorkOrderService {
  const withToken = createWithAccessToken(auth);

  return {
    listForCurrentUser() {
      return withToken(async (token) => {
        const session = await auth.getSession();
        const customerFilter =
          session?.user.role === 'CUSTOMER' && session.user.customerId
            ? `?customerId=${encodeURIComponent(session.user.customerId)}`
            : '';

        const orders = await apiRequest<BackendWorkOrderResponse[]>(`/work-orders${customerFilter}`, {
          token,
        });

        const filtered =
          session?.user.role === 'TECHNICIAN'
            ? orders.filter((order) => !order.workerId || order.workerId === session.user.id)
            : orders;

        return Promise.all(
          filtered.map((order) => mapOrder(order, token, [], session?.user)),
        );
      });
    },

    getById(id) {
      return withToken((token) => fetchOrderById(auth, token, id));
    },

    create(input) {
      return withToken(async (token) => {
        const session = await auth.getSession();
        const customerId = session?.user.customerId;
        if (!customerId) {
          throw createApiError(
            'VALIDATION_ERROR',
            'Customer account is not linked to a customer record. Set EXPO_PUBLIC_CUSTOMER_ID or use a contact email that matches a customer.',
          );
        }

        let productId = input.assetId;
        if (input.newAsset) {
          productId = await createProductFromAssetInput(token, customerId, input.newAsset);
        }

        const order = await apiRequest<BackendWorkOrderResponse>('/work-orders', {
          method: 'POST',
          token,
          body: {
            customerId,
            description: input.problemDescription,
            productId: productId ?? null,
          },
        });

        if (input.address || input.contactPersonName) {
          try {
            await apiRequest(`/customers/${customerId}`, {
              method: 'PATCH',
              token,
              body: {
                address: input.address,
              },
            });
            await apiRequest(`/customers/${customerId}/contact`, {
              method: 'PATCH',
              token,
              body: {
                name: input.contactPersonName,
                phone: input.contactPhone ?? null,
              },
            });
          } catch {
            // Work order was created; profile sync is best-effort.
          }
        }

        return fetchOrderById(auth, token, order.id);
      });
    },

    listAvailableForTechnician() {
      return withToken(async (token) => {
        const orders = await apiRequest<BackendWorkOrderResponse[]>('/work-orders', { token });
        const available = orders.filter((order) => !order.workerId && order.stage !== 'repaired');
        const session = await auth.getSession();
        return Promise.all(available.map((order) => mapOrder(order, token, [], session?.user)));
      });
    },

    assignToSelf(id) {
      return withToken(async (token) => {
        const session = await auth.getSession();
        if (!session) {
          throw createApiError('UNAUTHORIZED', 'Not authenticated');
        }

        await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, {
          method: 'PATCH',
          token,
          body: { workerId: session.user.id },
        });
        await apiRequest(`/work-orders/${id}/history`, {
          method: 'POST',
          token,
          body: { text: 'Assigned to technician.' },
        });
        return fetchOrderById(auth, token, id);
      });
    },

    advanceStage(id) {
      return withToken(async (token) => {
        const current = await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, { token });
        const mappedCurrent = mapWorkOrderFromBackend(current);
        const next = getNextWorkflowStage(mappedCurrent.workflowStage);
        if (!next) {
          throw createApiError('VALIDATION_ERROR', 'Work order is already at the final stage');
        }

        await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, {
          method: 'PATCH',
          token,
          body: { stage: mapWorkflowStageToBackendStage(next) },
        });
        await apiRequest(`/work-orders/${id}/history`, {
          method: 'POST',
          token,
          body: { text: `Stage changed to ${next}.` },
        });
        return fetchOrderById(auth, token, id);
      });
    },

    updateEstimate(id, input) {
      return withToken(async (token) => {
        await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, {
          method: 'PATCH',
          token,
          body: { estimatedDate: input.estimatedCompletionDate },
        });
        await apiRequest(`/work-orders/${id}/history`, {
          method: 'POST',
          token,
          body: { text: `Estimate updated: ${input.estimatedCompletionDate}. ${input.reason}` },
        });
        return fetchOrderById(auth, token, id);
      });
    },

    addComment(id, input) {
      return withToken(async (token) => {
        const prefix = input.customerVisible ? '' : '[Internal] ';
        await apiRequest(`/work-orders/${id}/history`, {
          method: 'POST',
          token,
          body: { text: `${prefix}${input.message}` },
        });
        return fetchOrderById(auth, token, id);
      });
    },

    updateCustomer(id, input) {
      return withToken(async (token) => {
        const order = await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, { token });
        await apiRequest<BackendWorkOrderResponse>(`/work-orders/${id}`, {
          method: 'PATCH',
          token,
          body: { description: input.problemDescription },
        });
        await apiRequest(`/customers/${order.customerId}`, {
          method: 'PATCH',
          token,
          body: { address: input.address },
        });
        try {
          await apiRequest(`/customers/${order.customerId}/contact`, {
            method: 'PATCH',
            token,
            body: {
              name: input.contactPersonName,
              phone: input.contactPhone ?? null,
            },
          });
        } catch {
          await apiRequest(`/customers/${order.customerId}/contact`, {
            method: 'POST',
            token,
            body: {
              name: input.contactPersonName,
              phone: input.contactPhone ?? null,
            },
          });
        }
        return fetchOrderById(auth, token, id);
      });
    },
  };
}
