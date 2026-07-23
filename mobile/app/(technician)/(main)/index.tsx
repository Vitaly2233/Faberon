import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import {
  useAvailableWorkOrdersQuery,
  useSessionQuery,
  useWorkOrdersQuery,
} from '@/hooks/use-app-queries';
import { getMyAssignedOrders } from '@/utils/work-orders';

export default function TechnicianHomeScreen() {
  const strings = useStrings();
  const sessionQuery = useSessionQuery();
  const workOrdersQuery = useWorkOrdersQuery();
  const availableQuery = useAvailableWorkOrdersQuery();

  const technicianId = sessionQuery.data?.user.id;
  const assignedCount = technicianId
    ? getMyAssignedOrders(workOrdersQuery.data ?? [], technicianId).length
    : 0;

  return (
    <Screen>
      <Text style={styles.title}>{strings.technician.homeTitle}</Text>
      <Text style={styles.subtitle}>{strings.technician.homeSubtitle}</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{availableQuery.data?.length ?? 0}</Text>
          <Text style={styles.statLabel}>{strings.tabs.available}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{assignedCount}</Text>
          <Text style={styles.statLabel}>{strings.tabs.myOrders}</Text>
        </Card>
      </View>

      <AppButton label={strings.tabs.available} onPress={() => router.push('/(technician)/available' as Href)} />
      <AppButton
        label={strings.tabs.myOrders}
        variant="secondary"
        onPress={() => router.push('/(technician)/my-orders' as Href)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
});
