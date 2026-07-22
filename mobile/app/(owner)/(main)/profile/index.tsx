import { Feather } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useLogoutMutation, useTechnicianProfileQuery } from '@/hooks/use-app-queries';

export default function OwnerProfileScreen() {
  const strings = useStrings();
  const profileQuery = useTechnicianProfileQuery();
  const logoutMutation = useLogoutMutation();

  const profile = profileQuery.data;
  const initials =
    profile?.displayName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '??';

  if (profileQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  const rows = [
    { icon: 'user' as const, label: strings.technician.fullName, value: profile?.displayName ?? '—' },
    { icon: 'mail' as const, label: strings.auth.email, value: profile?.email ?? '—' },
    { icon: 'phone' as const, label: strings.profile.phone, value: profile?.phone ?? '—' },
    {
      icon: 'map-pin' as const,
      label: strings.technician.serviceBase,
      value: profile?.serviceBaseAddress ?? '—',
    },
  ];

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.title}>{strings.tabs.profile}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.profile.settings}
          onPress={() => router.push('/(owner)/profile/settings' as Href)}
          style={styles.settingsButton}
        >
          <Feather name="settings" size={17} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{initials}</Text>
        </View>
        <Text style={styles.name}>{profile?.displayName}</Text>
        <Text style={styles.subtitle}>{strings.owner.accountLabel}</Text>
      </View>

      <Card style={styles.infoCard}>
        {rows.map((row, index) => (
          <View key={row.label} style={[styles.infoRow, index > 0 && styles.infoBorder]}>
            <View style={styles.infoIcon}>
              <Feather name={row.icon} size={16} color={colors.text.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </Card>

      <AppButton
        label={strings.auth.signOut}
        variant="destructive"
        loading={logoutMutation.isPending}
        onPress={() => logoutMutation.mutate(undefined, { onSuccess: () => router.replace('/(auth)/login') })}
        style={styles.signOut}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.primary,
  },
  avatarLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.inverse,
  },
  name: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  infoBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
  infoContent: {
    flex: 1,
    gap: spacing.xs,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
  infoValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  signOut: {
    marginTop: spacing.lg,
  },
});
