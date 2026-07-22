import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { EstimateChangeFormValues } from '@/schemas/auth.schema';
import type {
  CreateCustomerWorkOrderFormValues,
  UpdateCustomerWorkOrderFormValues,
  WorkOrderCommentFormValues,
} from '@/schemas/work-order.schema';
import { services } from '@/services';

function invalidateWorkOrderQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  order: { id: string },
) {
  queryClient.invalidateQueries({ queryKey: queryKeys.workOrders });
  queryClient.invalidateQueries({ queryKey: queryKeys.availableWorkOrders });
  queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
  queryClient.invalidateQueries({ queryKey: queryKeys.workOrder(order.id) });
}

export function useWorkOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.workOrders,
    queryFn: () => services.workOrders.listForCurrentUser(),
  });
}

export function useWorkOrderQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.workOrder(id),
    queryFn: () => services.workOrders.getById(id),
    enabled: Boolean(id),
  });
}

export function useAvailableWorkOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.availableWorkOrders,
    queryFn: () => services.workOrders.listAvailableForTechnician(),
  });
}

export function useCreateWorkOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerWorkOrderFormValues) => services.workOrders.create(input),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.assets });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useAssignWorkOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.workOrders.assignToSelf(id),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      invalidateWorkOrderQueries(queryClient, order);
    },
  });
}

export function useAdvanceStageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.workOrders.advanceStage(id),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      invalidateWorkOrderQueries(queryClient, order);
    },
  });
}

export function useUpdateEstimateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EstimateChangeFormValues }) =>
      services.workOrders.updateEstimate(id, input),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      invalidateWorkOrderQueries(queryClient, order);
    },
  });
}

export function useAddCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkOrderCommentFormValues }) =>
      services.workOrders.addComment(id, input),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      invalidateWorkOrderQueries(queryClient, order);
    },
  });
}

export function useUpdateCustomerWorkOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerWorkOrderFormValues }) =>
      services.workOrders.updateCustomer(id, input),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.workOrder(order.id), order);
      invalidateWorkOrderQueries(queryClient, order);
    },
  });
}
