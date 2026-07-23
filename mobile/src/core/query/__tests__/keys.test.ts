import { queryKeys } from '@/core/query/keys';

describe('queryKeys', () => {
  it('builds stable work order keys', () => {
    expect(queryKeys.workOrder('wo-1')).toEqual(['workOrders', 'wo-1']);
    expect(queryKeys.pricing('wo-1')).toEqual(['pricing', 'wo-1']);
  });

  it('keeps session key constant', () => {
    expect(queryKeys.session).toEqual(['session']);
  });
});
