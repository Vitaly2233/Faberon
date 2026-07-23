import { createApiError } from '@/services/api/errors';
import { mockAssetService } from '@/services/assets/mock-asset.service';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { pushMockNotification } from '@/services/notifications/mock-notification.service';
import { mockWorkOrders } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import type { EstimateChangeFormValues } from '@/schemas/auth.schema';
import type {
  CreateCustomerWorkOrderFormValues,
  UpdateCustomerWorkOrderFormValues,
  WorkOrderCommentFormValues,
} from '@/schemas/work-order.schema';
import type { WorkOrderService } from '@/services/work-orders/work-order.service';
import type { WorkOrder } from '@/types/work-order';
import { formatIsoDate, nowIso } from '@/utils/dates';
import { canCustomerEditWorkOrder } from '@/utils/permissions';
import { getStrings } from '@/constants/i18n';
import {
  getNextWorkflowStage,
  canTechnicianAdvanceStage,
} from '@/utils/work-orders';

let workOrders = clone(mockWorkOrders);
let nextNumber = Math.max(...workOrders.map((order) => order.number)) + 1;

const CUSTOMER_USER_BY_CUSTOMER_ID: Record<string, string> = {
  'customer-c1': 'customer-user-1',
};

function notifyCustomer(
  customerId: string,
  input: {
    workOrderId: string;
    type: Parameters<typeof pushMockNotification>[0]['type'];
    title: string;
    body: string;
  },
): void {
  const userId = CUSTOMER_USER_BY_CUSTOMER_ID[customerId];
  if (!userId) {
    return;
  }
  pushMockNotification({
    userId,
    workOrderId: input.workOrderId,
    type: input.type,
    title: input.title,
    body: input.body,
    deepLink: `/work-orders/${input.workOrderId}`,
  });
}

async function getScopedOrders(): Promise<WorkOrder[]> {
  const session = await mockAuthService.getSession();
  if (!session) {
    return [];
  }

  if (session.user.role === 'CUSTOMER' && session.user.customerId) {
    return workOrders.filter((order) => order.customerId === session.user.customerId);
  }

  if (session.user.role === 'TECHNICIAN') {
    return workOrders.filter(
      (order) =>
        !order.assignedTechnicianId || order.assignedTechnicianId === session.user.id,
    );
  }

  return workOrders;
}

function findOrderIndex(id: string): number {
  return workOrders.findIndex((item) => item.id === id);
}

function updateOrderAt(index: number, order: WorkOrder): WorkOrder {
  workOrders[index] = order;
  return clone(order);
}

export class MockWorkOrderService implements WorkOrderService {
  async listForCurrentUser(): Promise<WorkOrder[]> {
    await delay();
    return clone(await getScopedOrders());
  }

  async getById(id: string): Promise<WorkOrder> {
    await delay();
    const scoped = await getScopedOrders();
    const order = scoped.find((item) => item.id === id);
    if (!order) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }
    return clone(order);
  }

  async create(input: CreateCustomerWorkOrderFormValues): Promise<WorkOrder> {
    await delay();
    const session = await mockAuthService.getSession();
    let assetId = input.assetId;

    if (input.newAsset) {
      const createdAsset = await mockAssetService.create(input.newAsset);
      assetId = createdAsset.id;
    }

    const created: WorkOrder = {
      id: `wo-${nextNumber}`,
      number: nextNumber,
      tenantId: 'tenant-faberon',
      customerId: session?.user.customerId ?? 'customer-c1',
      customerName: 'Grand Hotel',
      address: input.address,
      contactPersonName: input.contactPersonName,
      contactPhone: input.contactPhone,
      problemDescription: input.problemDescription,
      assetId,
      creationSource: 'CUSTOMER_REQUEST',
      status: 'SUBMITTED',
      workflowStage: 'WAITING',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      invoiceDisplayMode: 'ITEMIZED',
      timeline: [
        {
          id: `tl-${nextNumber}`,
          type: 'WORK_ORDER_CREATED',
          title: 'Work order created',
          description: 'Work order created by client.',
          authorId: session?.user.id ?? 'customer-user-1',
          authorName: session?.user.displayName ?? 'John Doe',
          occurredAt: nowIso(),
          customerVisible: true,
        },
      ],
    };
    nextNumber += 1;
    workOrders = [created, ...workOrders];

    if (session?.user.id) {
      pushMockNotification({
        userId: session.user.id,
        workOrderId: created.id,
        type: 'WORK_ORDER_ACCEPTED',
        title: 'Request received',
        body: 'Your request was submitted. We will notify you when a technician is assigned.',
        deepLink: `/work-orders/${created.id}`,
      });
    }

    return clone(created);
  }

  async listAvailableForTechnician(): Promise<WorkOrder[]> {
    await delay();
    return clone(
      workOrders.filter(
        (order) =>
          !order.assignedTechnicianId &&
          order.status !== 'COMPLETED' &&
          order.status !== 'CANCELLED',
      ),
    );
  }

  async assignToSelf(id: string): Promise<WorkOrder> {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can assign work orders');
    }

    const index = findOrderIndex(id);
    if (index === -1) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }

    const order = workOrders[index];
    if (order.assignedTechnicianId) {
      throw createApiError('VALIDATION_ERROR', 'Work order is already assigned');
    }

    const updated: WorkOrder = {
      ...order,
      status: 'IN_PROGRESS',
      assignedTechnicianId: session.user.id,
      assignedTechnicianName: session.user.displayName,
      updatedAt: nowIso(),
      timeline: [
        ...order.timeline,
        {
          id: `tl-assign-${order.id}`,
          type: 'TECHNICIAN_ASSIGNED',
          title: 'Technician assigned',
          description: `${session.user.displayName} assigned to this work order.`,
          authorId: session.user.id,
          authorName: session.user.displayName,
          occurredAt: nowIso(),
          customerVisible: true,
        },
      ],
    };

    notifyCustomer(order.customerId, {
      workOrderId: order.id,
      type: 'TECHNICIAN_ASSIGNED',
      title: 'Technician assigned',
      body: `${session.user.displayName} was assigned to your repair.`,
    });

    return updateOrderAt(index, updated);
  }

  async advanceStage(id: string): Promise<WorkOrder> {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can update repair stages');
    }

    const index = findOrderIndex(id);
    if (index === -1) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }

    const order = workOrders[index];
    if (order.assignedTechnicianId !== session.user.id) {
      throw createApiError('FORBIDDEN', 'You are not assigned to this work order');
    }
    if (!canTechnicianAdvanceStage(order.workflowStage)) {
      throw createApiError('VALIDATION_ERROR', 'Repair stage cannot be advanced further');
    }

    const nextStage = getNextWorkflowStage(order.workflowStage);
    if (!nextStage) {
      throw createApiError('VALIDATION_ERROR', 'No next stage available');
    }

    const stageLabel = getStrings('en').workflowStages[nextStage];
    const stageChangedEvent = {
      id: `tl-stage-${order.id}-${nextStage}`,
      type: 'STAGE_CHANGED' as const,
      title: 'Repair stage updated',
      description: `Stage changed to ${stageLabel}.`,
      authorId: session.user.id,
      authorName: session.user.displayName,
      occurredAt: nowIso(),
      customerVisible: true,
      metadata: { stage: nextStage },
    };
    const timeline =
      nextStage === 'REPAIRED'
        ? [
            ...order.timeline,
            stageChangedEvent,
            {
              id: `tl-repair-${order.id}`,
              type: 'REPAIR_COMPLETED' as const,
              title: 'Repair completed',
              description: 'Repair work has been completed.',
              authorId: session.user.id,
              authorName: session.user.displayName,
              occurredAt: nowIso(),
              customerVisible: true,
            },
          ]
        : [...order.timeline, stageChangedEvent];

    const updated: WorkOrder = {
      ...order,
      workflowStage: nextStage,
      status: nextStage === 'REPAIRED' ? 'COMPLETED' : order.status,
      updatedAt: nowIso(),
      timeline,
    };

    notifyCustomer(order.customerId, {
      workOrderId: order.id,
      type: 'STAGE_CHANGED',
      title: 'Repair update',
      body: `Your repair is now at ${stageLabel}.`,
    });

    if (nextStage === 'REPAIRED') {
      notifyCustomer(order.customerId, {
        workOrderId: order.id,
        type: 'REPAIR_COMPLETED',
        title: 'Repair update',
        body: 'Your repair has been completed.',
      });
    }

    return updateOrderAt(index, updated);
  }

  async updateEstimate(id: string, input: EstimateChangeFormValues): Promise<WorkOrder> {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can update estimates');
    }

    const index = findOrderIndex(id);
    if (index === -1) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }

    const order = workOrders[index];
    if (order.assignedTechnicianId !== session.user.id) {
      throw createApiError('FORBIDDEN', 'You are not assigned to this work order');
    }

    const hadEstimate = Boolean(order.estimatedCompletionDate);
    const updated: WorkOrder = {
      ...order,
      estimatedCompletionDate: input.estimatedCompletionDate,
      updatedAt: nowIso(),
      timeline: [
        ...order.timeline,
        {
          id: `tl-estimate-${order.id}-${Date.now()}`,
          type: hadEstimate ? 'ESTIMATE_CHANGED' : 'ESTIMATE_ADDED',
          title: hadEstimate ? 'Estimated date changed' : 'Estimated completion date set',
          description: `${input.reason} New estimate: ${formatIsoDate(input.estimatedCompletionDate)}.`,
          authorId: session.user.id,
          authorName: session.user.displayName,
          occurredAt: nowIso(),
          customerVisible: true,
        },
      ],
    };

    notifyCustomer(order.customerId, {
      workOrderId: order.id,
      type: hadEstimate ? 'ESTIMATE_CHANGED' : 'ESTIMATE_ADDED',
      title: 'Repair update',
      body: `Estimated ready ${formatIsoDate(input.estimatedCompletionDate)}.`,
    });

    return updateOrderAt(index, updated);
  }

  async addComment(id: string, input: WorkOrderCommentFormValues): Promise<WorkOrder> {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'TECHNICIAN') {
      throw createApiError('FORBIDDEN', 'Only technicians can add comments');
    }

    const index = findOrderIndex(id);
    if (index === -1) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }

    const order = workOrders[index];
    if (order.assignedTechnicianId !== session.user.id) {
      throw createApiError('FORBIDDEN', 'You are not assigned to this work order');
    }

    const updated: WorkOrder = {
      ...order,
      updatedAt: nowIso(),
      timeline: [
        ...order.timeline,
        {
          id: `tl-comment-${order.id}-${Date.now()}`,
          type: 'COMMENT_ADDED',
          title: 'Comment added',
          description: input.message,
          authorId: session.user.id,
          authorName: session.user.displayName,
          occurredAt: nowIso(),
          customerVisible: input.customerVisible,
        },
      ],
    };

    if (input.customerVisible) {
      notifyCustomer(order.customerId, {
        workOrderId: order.id,
        type: 'COMMENT_ADDED',
        title: 'Repair update',
        body: input.message,
      });
    }

    return updateOrderAt(index, updated);
  }

  async updateCustomer(id: string, input: UpdateCustomerWorkOrderFormValues): Promise<WorkOrder> {
    await delay(200);
    const session = await mockAuthService.getSession();
    if (!session || session.user.role !== 'CUSTOMER') {
      throw createApiError('FORBIDDEN', 'Only customers can edit work orders');
    }

    const index = findOrderIndex(id);
    if (index === -1) {
      throw createApiError('WORK_ORDER_NOT_FOUND', 'Work order does not exist');
    }

    const order = workOrders[index];
    if (order.customerId !== session.user.customerId) {
      throw createApiError('FORBIDDEN', 'You do not have access to this work order');
    }
    if (!canCustomerEditWorkOrder(order)) {
      throw createApiError('VALIDATION_ERROR', 'This work order can no longer be edited');
    }

    const updated: WorkOrder = {
      ...order,
      problemDescription: input.problemDescription,
      address: input.address,
      contactPersonName: input.contactPersonName,
      contactPhone: input.contactPhone,
      updatedAt: nowIso(),
    };

    return updateOrderAt(index, updated);
  }
}

export const mockWorkOrderService = new MockWorkOrderService();
