import { Tabs } from 'expo-router';

import { createTabScreenOptions } from '@/constants/tab-bar';
import { useStrings } from '@/hooks/use-i18n';

export default function CustomerTabsLayout() {
  const strings = useStrings();
  return (
    <Tabs screenOptions={createTabScreenOptions('customer', strings)}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="assets" />
      <Tabs.Screen name="work-orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
