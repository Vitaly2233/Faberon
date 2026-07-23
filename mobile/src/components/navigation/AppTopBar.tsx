import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { HeaderIconButton } from '@/components/navigation/HeaderIconButton';
import { NotificationBellButton } from '@/components/navigation/NotificationBellButton';
import { useStrings } from '@/hooks/use-i18n';
import { routes } from '@/constants/routes';
import { colors, spacing, typography } from '@/constants/tokens';

interface AppTopBarProps {
  showBrand?: boolean;
  title?: string;
  showSettings?: boolean;
  trailing?: ReactNode;
}

export function AppTopBar({
  showBrand = false,
  title,
  showSettings = false,
  trailing,
}: AppTopBarProps) {
  const strings = useStrings();
  const leadingLabel = showBrand ? strings.appName : title;

  return (
    <View style={styles.topBar}>
      {leadingLabel ? (
        <Text
          style={[styles.leading, showBrand ? styles.brand : styles.title]}
          numberOfLines={2}
        >
          {leadingLabel}
        </Text>
      ) : (
        <View style={styles.leadingSpacer} />
      )}
      <View style={styles.actions}>
        <NotificationBellButton />
        {showSettings ? (
          <HeaderIconButton
            icon="settings"
            accessibilityLabel={strings.profile.settings}
            onPress={() => router.push(routes.customer.profileSettings)}
          />
        ) : null}
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  leading: {
    flex: 1,
  },
  leadingSpacer: {
    flex: 1,
  },
  brand: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
});
