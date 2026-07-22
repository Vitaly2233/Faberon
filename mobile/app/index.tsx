import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/tokens';
import { getRoleHomePath } from '@/features/auth/auth-redirect';
import { useSessionQuery } from '@/hooks/use-app-queries';

export default function IndexScreen() {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return (
      <View style={styles.loading}>
        <LoadingState />
      </View>
    );
  }

  if (!sessionQuery.data) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={getRoleHomePath(sessionQuery.data.user.role)} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.canvas,
  },
});
