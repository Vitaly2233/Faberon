import type { BackendWorkOrderStage } from '@/services/api/backend-types';
import type { RepairWorkflowStage } from '@/types/work-order';

const BACKEND_TO_MOBILE: Record<BackendWorkOrderStage, RepairWorkflowStage> = {
  waiting: 'WAITING',
  diagnostics: 'TRAVEL_AND_DIAGNOSIS',
  'waiting-parts': 'WAITING_FOR_PARTS',
  repaired: 'REPAIRED',
};

const MOBILE_TO_BACKEND: Record<RepairWorkflowStage, BackendWorkOrderStage> = {
  WAITING: 'waiting',
  TRAVEL_AND_DIAGNOSIS: 'diagnostics',
  WAITING_FOR_PARTS: 'waiting-parts',
  REPAIRED: 'repaired',
};

export function mapBackendStageToWorkflow(stage: BackendWorkOrderStage): RepairWorkflowStage {
  return BACKEND_TO_MOBILE[stage];
}

export function mapWorkflowStageToBackend(stage: RepairWorkflowStage): BackendWorkOrderStage {
  return MOBILE_TO_BACKEND[stage];
}
