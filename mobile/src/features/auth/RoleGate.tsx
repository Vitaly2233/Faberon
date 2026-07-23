import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LoadingState } from '@/components/ui/LoadingState';
import type { UserRole } from '@/constants/roles';
import { colors } from '@/constants/tokens';
import { getRoleHomePath } from '@/features/auth/auth-redirect';
import { useSessionQuery } from '@/hooks/use-app-queries';

interface RoleGateProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export function RoleGate({ allowedRole, children }: RoleGateProps) {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return (
      <View style={styles.loading}>
        <LoadingState />
      </View>
    );
  }

  const session = sessionQuery.data;
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (session.user.role !== allowedRole) {
    return <Redirect href={getRoleHomePath(session.user.role)} />;
  }

  return children;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.canvas,
  },
});
