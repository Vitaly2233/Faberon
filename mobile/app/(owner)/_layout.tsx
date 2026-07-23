import { Stack } from 'expo-router';

import { RoleGate } from '@/features/auth/RoleGate';

export default function OwnerLayout() {
  return (
    <RoleGate allowedRole="OWNER">
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGate>
  );
}
