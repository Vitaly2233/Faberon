import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

import { TabBarButton } from '@/components/navigation/TabBarButton';
import type { AppStrings } from '@/constants/i18n/types';
import { colors, layout, typography } from '@/constants/tokens';

export const tabBarIconSize = 24;

type TabScreenOptions = NonNullable<ComponentProps<typeof Tabs>['screenOptions']>;
type TabTitleKey = keyof AppStrings['tabs'];
type TabRole = 'customer' | 'technician' | 'owner';

type TabRouteConfig = {
  titleKey: TabTitleKey;
  icon: keyof typeof Feather.glyphMap;
  hidden?: boolean;
};

const TAB_ROUTE_CONFIG: Record<TabRole, Record<string, TabRouteConfig>> = {
  customer: {
    index: { titleKey: 'home', icon: 'home' },
    assets: { titleKey: 'assets', icon: 'printer' },
    'work-orders': { titleKey: 'workOrders', icon: 'clipboard' },
    profile: { titleKey: 'profile', icon: 'user' },
  },
  technician: {
    index: { titleKey: 'home', icon: 'home' },
    available: { titleKey: 'available', icon: 'inbox' },
    'my-orders': { titleKey: 'myOrders', icon: 'tool' },
    profile: { titleKey: 'profile', icon: 'user' },
  },
  owner: {
    index: { titleKey: 'workOrders', icon: 'clipboard' },
    profile: { titleKey: 'profile', icon: 'user' },
  },
};

const baseTabBarScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.text.primary,
  tabBarInactiveTintColor: colors.text.tertiary,
  tabBarButton: (props: React.ComponentProps<typeof TabBarButton>) => <TabBarButton {...props} />,
  tabBarStyle: {
    height: layout.bottomNavHeight,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.surface,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabBarIconStyle: {
    marginBottom: 0,
  },
  tabBarLabelStyle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    marginTop: 2,
    marginBottom: 0,
  },
} satisfies TabScreenOptions;

export const tabBarScreenOptions: TabScreenOptions = baseTabBarScreenOptions;

export function createTabScreenOptions(role: TabRole, strings: AppStrings): TabScreenOptions {
  const roleConfig = TAB_ROUTE_CONFIG[role];

  return ({ route }) => {
    const config = roleConfig[route.name];
    if (!config) {
      return baseTabBarScreenOptions;
    }

    return {
      ...baseTabBarScreenOptions,
      title: strings.tabs[config.titleKey],
      tabBarIcon: ({ color }) => <Feather name={config.icon} color={color} size={tabBarIconSize} />,
      ...(config.hidden ? { href: null } : {}),
    };
  };
}
