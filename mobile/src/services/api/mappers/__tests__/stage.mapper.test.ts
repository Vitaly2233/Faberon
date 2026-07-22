import {
  mapBackendStageToWorkflow,
  mapWorkflowStageToBackend,
} from '@/services/api/mappers/stage.mapper';

describe('stage.mapper', () => {
  it('maps backend stages to mobile workflow stages', () => {
    expect(mapBackendStageToWorkflow('waiting')).toBe('WAITING');
    expect(mapBackendStageToWorkflow('diagnostics')).toBe('TRAVEL_AND_DIAGNOSIS');
    expect(mapBackendStageToWorkflow('waiting-parts')).toBe('WAITING_FOR_PARTS');
    expect(mapBackendStageToWorkflow('repaired')).toBe('REPAIRED');
  });

  it('maps mobile workflow stages to backend stages', () => {
    expect(mapWorkflowStageToBackend('WAITING')).toBe('waiting');
    expect(mapWorkflowStageToBackend('TRAVEL_AND_DIAGNOSIS')).toBe('diagnostics');
    expect(mapWorkflowStageToBackend('WAITING_FOR_PARTS')).toBe('waiting-parts');
    expect(mapWorkflowStageToBackend('REPAIRED')).toBe('repaired');
  });
});
