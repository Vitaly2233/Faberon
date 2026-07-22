import { Tabs } from 'expo-router';

import { createTabScreenOptions } from '@/constants/tab-bar';
import { useStrings } from '@/hooks/use-i18n';

export default function TechnicianMainTabsLayout() {
  const strings = useStrings();
  return (
    <Tabs screenOptions={createTabScreenOptions('technician', strings)}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="available" />
      <Tabs.Screen name="my-orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
