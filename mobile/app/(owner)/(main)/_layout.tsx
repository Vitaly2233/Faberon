import { Tabs } from 'expo-router';

import { createTabScreenOptions } from '@/constants/tab-bar';
import { useStrings } from '@/hooks/use-i18n';

export default function OwnerMainTabsLayout() {
  const strings = useStrings();
  return <Tabs screenOptions={createTabScreenOptions('owner', strings)} />;
}
