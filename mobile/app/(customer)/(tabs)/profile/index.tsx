import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppTopBar } from '@/components/navigation/AppTopBar';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useCustomerProfileQuery, useLogoutMutation, useSessionQuery } from '@/hooks/use-app-queries';

export default function CustomerProfileScreen() {
  const strings = useStrings();
  const sessionQuery = useSessionQuery();
  const profileQuery = useCustomerProfileQuery();
  const logoutMutation = useLogoutMutation();

  const user = sessionQuery.data?.user;
  const company = profileQuery.data?.company;
  const defaultContact = company?.contacts.find((contact) => contact.isDefault);
  const initials =
    user?.displayName
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
    {
      icon: 'user' as const,
      label: strings.profile.contactPerson,
      value: defaultContact?.name ?? user?.displayName ?? '—',
    },
    {
      icon: 'home' as const,
      label: strings.profile.company,
      value: company?.companyName ?? '—',
    },
    {
      icon: 'mail' as const,
      label: strings.auth.email,
      value: user?.email ?? '—',
    },
    {
      icon: 'phone' as const,
      label: strings.profile.phone,
      value: defaultContact?.phone ?? '—',
    },
    {
      icon: 'map-pin' as const,
      label: strings.profile.defaultAddress,
      value: company?.defaultAddress ?? '—',
    },
  ];

  return (
    <Screen>
      <AppTopBar title={strings.tabs.profile} showSettings />

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.subtitle}>{strings.profile.clientAccount}</Text>
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

      <View style={styles.providerCard}>
        <Feather name="shield" size={19} color={colors.text.primary} />
        <View style={styles.providerContent}>
          <Text style={styles.providerTitle}>{strings.profile.serviceProvider}</Text>
          <Text style={styles.providerBody}>Faberon Service Co.{'\n'}+1 (555) 010-4400</Text>
        </View>
      </View>

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
  providerCard: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii['2xl'],
    backgroundColor: colors.background.muted,
    padding: spacing.lg,
  },
  providerContent: {
    flex: 1,
    gap: spacing.xs,
  },
  providerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  providerBody: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  signOut: {
    marginTop: spacing.lg,
  },
});
