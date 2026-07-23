import { Stack } from 'expo-router';

import { RoleGate } from '@/features/auth/RoleGate';

export default function TechnicianLayout() {
  return (
    <RoleGate allowedRole="TECHNICIAN">
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGate>
  );
}
