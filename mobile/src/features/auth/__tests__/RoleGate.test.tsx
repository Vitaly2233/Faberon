import { render } from '@testing-library/react-native';

import { RoleGate } from '@/features/auth/RoleGate';
import { useSessionQuery } from '@/hooks/use-app-queries';

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
  };
});

jest.mock('@/hooks/use-app-queries', () => ({
  useSessionQuery: jest.fn(),
}));

const mockedUseSessionQuery = useSessionQuery as jest.MockedFunction<typeof useSessionQuery>;

describe('RoleGate', () => {
  it('shows loading state while session is loading', async () => {
    mockedUseSessionQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
    } as ReturnType<typeof useSessionQuery>);

    const { Text } = require('react-native');
    const { queryByTestId } = await render(
      <RoleGate allowedRole="CUSTOMER">
        <Text testID="protected">Protected</Text>
      </RoleGate>,
    );

    expect(queryByTestId('protected')).toBeNull();
  });

  it('redirects unauthenticated users to login', async () => {
    mockedUseSessionQuery.mockReturnValue({
      isLoading: false,
      data: null,
    } as ReturnType<typeof useSessionQuery>);

    const { Text } = require('react-native');
    const { getByTestId } = await render(
      <RoleGate allowedRole="CUSTOMER">
        <Text testID="protected">Protected</Text>
      </RoleGate>,
    );

    expect(getByTestId('redirect')).toHaveTextContent('/(auth)/login');
  });

  it('redirects users with the wrong role', async () => {
    mockedUseSessionQuery.mockReturnValue({
      isLoading: false,
      data: {
        accessToken: 'token',
        user: {
          id: 'tech-1',
          email: 'tech@example.com',
          displayName: 'Tech',
          role: 'TECHNICIAN',
          tenantId: 'tenant-1',
        },
      },
    } as ReturnType<typeof useSessionQuery>);

    const { Text } = require('react-native');
    const { getByTestId } = await render(
      <RoleGate allowedRole="CUSTOMER">
        <Text testID="protected">Protected</Text>
      </RoleGate>,
    );

    expect(getByTestId('redirect')).toHaveTextContent('/(technician)/');
  });

  it('renders children for the allowed role', async () => {
    mockedUseSessionQuery.mockReturnValue({
      isLoading: false,
      data: {
        accessToken: 'token',
        user: {
          id: 'customer-1',
          email: 'customer@example.com',
          displayName: 'Customer',
          role: 'CUSTOMER',
          tenantId: 'tenant-1',
        },
      },
    } as ReturnType<typeof useSessionQuery>);

    const { Text } = require('react-native');
    const { getByTestId } = await render(
      <RoleGate allowedRole="CUSTOMER">
        <Text testID="protected">Protected</Text>
      </RoleGate>,
    );

    expect(getByTestId('protected')).toBeTruthy();
  });
});
