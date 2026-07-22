import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import { openOwnerWorkOrder } from '@/features/owner/owner-navigation';
import { WorkOrderCard } from '@/features/work-orders/WorkOrderCard';
import { useWorkOrdersQuery } from '@/hooks/use-app-queries';

export default function OwnerWorkOrdersScreen() {
  const strings = useStrings();
  const workOrdersQuery = useWorkOrdersQuery();

  return (
    <Screen>
      <Text style={styles.title}>{strings.owner.workOrdersTitle}</Text>
      <Text style={styles.subtitle}>{strings.owner.workOrdersSubtitle}</Text>

      {workOrdersQuery.isLoading ? (
        <LoadingState />
      ) : workOrdersQuery.isError ? (
        <ErrorState message={strings.errors.loadWorkOrders} onRetry={() => workOrdersQuery.refetch()} />
      ) : workOrdersQuery.data?.length === 0 ? (
        <EmptyState title={strings.common.emptyTitle} description={strings.owner.noWorkOrders} />
      ) : (
        <View style={styles.list}>
          {workOrdersQuery.data?.map((order) => (
            <WorkOrderCard key={order.id} order={order} onPress={() => openOwnerWorkOrder(order.id)} />
          ))}
        </View>
      )}
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
    fontSize: typography.size.md,
    lineHeight: 18,
    color: colors.text.muted,
  },
  list: {
    gap: spacing.md,
  },
});
