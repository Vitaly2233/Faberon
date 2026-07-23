import type { EstimateChangeFormValues } from '@/schemas/auth.schema';
import type {
  CreateCustomerWorkOrderFormValues,
  UpdateCustomerWorkOrderFormValues,
  WorkOrderCommentFormValues,
} from '@/schemas/work-order.schema';
import type { WorkOrder } from '@/types/work-order';
export interface WorkOrderService {
  listForCurrentUser(): Promise<WorkOrder[]>;
  getById(id: string): Promise<WorkOrder>;
  create(input: CreateCustomerWorkOrderFormValues): Promise<WorkOrder>;
  listAvailableForTechnician(): Promise<WorkOrder[]>;
  assignToSelf(id: string): Promise<WorkOrder>;
  advanceStage(id: string): Promise<WorkOrder>;
  updateEstimate(id: string, input: EstimateChangeFormValues): Promise<WorkOrder>;
  addComment(id: string, input: WorkOrderCommentFormValues): Promise<WorkOrder>;
  updateCustomer(id: string, input: UpdateCustomerWorkOrderFormValues): Promise<WorkOrder>;
}
