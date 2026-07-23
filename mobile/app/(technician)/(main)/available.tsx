import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { openTechnicianWorkOrder } from '@/features/technician/technician-navigation';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { WorkOrderCard } from '@/features/work-orders/WorkOrderCard';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { useAssignWorkOrderMutation, useAvailableWorkOrdersQuery } from '@/hooks/use-app-queries';

export default function TechnicianAvailableScreen() {
  const strings = useStrings();
  const availableQuery = useAvailableWorkOrdersQuery();
  const assignMutation = useAssignWorkOrderMutation();
  const [assigningId, setAssigningId] = useState<string | null>(null);

  return (
    <Screen>
      <Text style={styles.title}>{strings.tabs.available}</Text>

      {availableQuery.isLoading ? (
        <LoadingState />
      ) : availableQuery.isError ? (
        <ErrorState message={strings.errors.loadAvailableJobs} onRetry={() => availableQuery.refetch()} />
      ) : availableQuery.data?.length === 0 ? (
        <EmptyState title={strings.common.emptyTitle} description={strings.technician.noAvailable} />
      ) : (
        <View style={styles.list}>
          {availableQuery.data?.map((order) => (
            <View key={order.id} style={styles.item}>
              <WorkOrderCard order={order} onPress={() => openTechnicianWorkOrder(order.id)} />
              <AppButton
                label={strings.technician.assignToMe}
                loading={assignMutation.isPending && assigningId === order.id}
                onPress={() => {
                  setAssigningId(order.id);
                  assignMutation.mutate(order.id, {
                    onSuccess: (assignedOrder) => {
                      setAssigningId(null);
                      openTechnicianWorkOrder(assignedOrder.id);
                    },
                    onError: () => setAssigningId(null),
                  });
                }}
              />
            </View>
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
    gap: spacing.lg,
  },
  item: {
    gap: spacing.md,
  },
});
