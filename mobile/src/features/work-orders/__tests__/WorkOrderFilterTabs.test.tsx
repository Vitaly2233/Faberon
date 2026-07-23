import { fireEvent, render } from '@testing-library/react-native';

import { WorkOrderFilterTabs } from '@/features/work-orders/WorkOrderFilterTabs';

jest.mock('@/hooks/use-i18n', () => ({
  useStrings: () => require('@/constants/i18n/en').strings,
}));

describe('WorkOrderFilterTabs', () => {
  const strings = require('@/constants/i18n/en').strings;

  it('renders filter chips in ACTIVE → COMPLETED → ALL order', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(<WorkOrderFilterTabs value="ACTIVE" onChange={onChange} />);

    expect(getByText(strings.workOrders.filters.active)).toBeTruthy();
    expect(getByText(strings.workOrders.filters.completed)).toBeTruthy();
    expect(getByText(strings.workOrders.filters.all)).toBeTruthy();
  });

  it('calls onChange when a chip is pressed', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(<WorkOrderFilterTabs value="ACTIVE" onChange={onChange} />);

    fireEvent.press(getByText(strings.workOrders.filters.completed));
    expect(onChange).toHaveBeenCalledWith('COMPLETED');
  });
});
