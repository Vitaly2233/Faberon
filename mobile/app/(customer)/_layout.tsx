import { Stack } from 'expo-router';

import { RoleGate } from '@/features/auth/RoleGate';

export default function CustomerLayout() {
  return (
    <RoleGate allowedRole="CUSTOMER">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notifications" />
      </Stack>
    </RoleGate>
  );
}
