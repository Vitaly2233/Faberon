import { openTechnicianWorkOrder } from '@/features/technician/technician-navigation';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { WorkOrderCard } from '@/features/work-orders/WorkOrderCard';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import { useSessionQuery, useWorkOrdersQuery } from '@/hooks/use-app-queries';
import { getMyAssignedOrders } from '@/utils/work-orders';

export default function TechnicianMyOrdersScreen() {
  const strings = useStrings();
  const sessionQuery = useSessionQuery();
  const workOrdersQuery = useWorkOrdersQuery();

  const assignedOrders = useMemo(() => {
    const technicianId = sessionQuery.data?.user.id;
    if (!technicianId) {
      return [];
    }
    return getMyAssignedOrders(workOrdersQuery.data ?? [], technicianId);
  }, [sessionQuery.data?.user.id, workOrdersQuery.data]);

  return (
    <Screen>
      <Text style={styles.title}>{strings.tabs.myOrders}</Text>

      {workOrdersQuery.isLoading ? (
        <LoadingState />
      ) : workOrdersQuery.isError ? (
        <ErrorState message={strings.errors.loadYourOrders} onRetry={() => workOrdersQuery.refetch()} />
      ) : assignedOrders.length === 0 ? (
        <EmptyState title={strings.common.emptyTitle} description={strings.technician.noAssigned} />
      ) : (
        <View style={styles.list}>
          {assignedOrders.map((order) => (
            <WorkOrderCard
              key={order.id}
              order={order}
              onPress={() => openTechnicianWorkOrder(order.id)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  list: {
    gap: spacing.md,
  },
});
