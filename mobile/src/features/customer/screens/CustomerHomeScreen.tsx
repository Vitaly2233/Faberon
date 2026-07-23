import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTopBar } from '@/components/navigation/AppTopBar';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { routes } from '@/constants/routes';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { ActiveRepairCard } from '@/features/work-orders/ActiveRepairCard';
import { ReportRepairButton } from '@/features/work-orders/ReportRepairButton';
import { useI18n } from '@/hooks/use-i18n';
import { useAssetsQuery, useNotificationsQuery, useWorkOrdersQuery } from '@/hooks/use-app-queries';
import {
  CUSTOMER_HOME_REPAIR_LIMIT,
  sortOrdersForCustomerHome,
} from '@/utils/customer-work-orders';
import { formatIsoDateTime } from '@/utils/dates';
import { Feather } from '@expo/vector-icons';

export function CustomerHomeScreen() {
  const { strings, dateLocale } = useI18n();
  const workOrdersQuery = useWorkOrdersQuery();
  const assetsQuery = useAssetsQuery();
  const notificationsQuery = useNotificationsQuery();

  const assetsById = useMemo(() => {
    const map = new Map(assetsQuery.data?.map((asset) => [asset.id, asset]) ?? []);
    return map;
  }, [assetsQuery.data]);

  const activeOrders = useMemo(
    () => sortOrdersForCustomerHome(workOrdersQuery.data ?? []),
    [workOrdersQuery.data],
  );
  const featuredOrders = activeOrders.slice(0, CUSTOMER_HOME_REPAIR_LIMIT);
  const latestNotification = notificationsQuery.data?.[0];

  const viewAllLabel =
    activeOrders.length > CUSTOMER_HOME_REPAIR_LIMIT
      ? strings.home.viewAllRepairsCount.replace('{count}', String(activeOrders.length))
      : strings.home.viewAllRepairs;

  if (workOrdersQuery.isLoading || assetsQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (workOrdersQuery.isError) {
    return (
      <Screen>
        <ErrorState
          message={strings.errors.loadRepairs}
          onRetry={() => workOrdersQuery.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppTopBar showBrand />

      <ReportRepairButton />

      {activeOrders.length > 0 ? (
        <View style={styles.activeRepairsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{strings.workOrders.activeRepairs}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(routes.customer.workOrders)}
            >
              <Text style={styles.viewAll}>{viewAllLabel}</Text>
            </Pressable>
          </View>
          <View style={styles.activeRepairsList}>
            {featuredOrders.map((order) => (
              <ActiveRepairCard
                key={order.id}
                order={order}
                asset={order.assetId ? assetsById.get(order.assetId) : undefined}
                onPress={() => router.push(routes.customer.workOrderDetail(order.id))}
              />
            ))}
          </View>
        </View>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyCopy}>{strings.workOrders.noActiveRepairs}</Text>
        </Card>
      )}

      {latestNotification ? (
        <View style={styles.latestUpdateSection}>
          <Text style={styles.sectionTitle}>{strings.home.latestUpdate}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(routes.customer.notifications)}
            style={styles.updateCard}
          >
            <View style={styles.updateIcon}>
              <Feather name="bell" size={15} color={colors.text.primary} />
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>{latestNotification.title}</Text>
              <Text style={styles.updateBody}>{latestNotification.body}</Text>
              <Text style={styles.updateMeta}>
                {formatIsoDateTime(latestNotification.createdAt, dateLocale)}
              </Text>
            </View>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  activeRepairsSection: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  activeRepairsList: {
    gap: spacing.md,
  },
  viewAll: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
  emptyCard: {
    marginTop: 0,
  },
  emptyCopy: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    color: colors.text.secondary,
  },
  latestUpdateSection: {
    marginTop: spacing['3xl'],
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  updateCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.background.muted,
    padding: spacing.lg,
  },
  updateIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  updateContent: {
    flex: 1,
    gap: spacing.xs,
  },
  updateTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  updateBody: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  updateMeta: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
});
