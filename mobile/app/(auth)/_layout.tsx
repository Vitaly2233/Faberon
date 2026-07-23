import { Redirect, Stack } from 'expo-router';

import { LoadingState } from '@/components/ui/LoadingState';
import { useSessionQuery } from '@/hooks/use-app-queries';
import { getRoleHomePath } from '@/features/auth/auth-redirect';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/tokens';

export default function AuthLayout() {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return (
      <View style={styles.loading}>
        <LoadingState />
      </View>
    );
  }

  if (sessionQuery.data) {
    return <Redirect href={getRoleHomePath(sessionQuery.data.user.role)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.login,
  },
});
