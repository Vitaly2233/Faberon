import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTopBar } from '@/components/navigation/AppTopBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { routes } from '@/constants/routes';
import { spacing } from '@/constants/tokens';
import { ReportRepairButton } from '@/features/work-orders/ReportRepairButton';
import { WorkOrderCard } from '@/features/work-orders/WorkOrderCard';
import { WorkOrderFilterTabs } from '@/features/work-orders/WorkOrderFilterTabs';
import { useStrings } from '@/hooks/use-i18n';
import { useAssetsQuery, useWorkOrdersQuery } from '@/hooks/use-app-queries';
import type { Asset } from '@/types/asset';
import { sortOrdersForCustomerHome } from '@/utils/customer-work-orders';
import { filterWorkOrders, type WorkOrderFilter } from '@/utils/work-orders';

export function CustomerWorkOrdersScreen() {
  const strings = useStrings();
  const [filter, setFilter] = useState<WorkOrderFilter>('ACTIVE');
  const workOrdersQuery = useWorkOrdersQuery();
  const assetsQuery = useAssetsQuery();

  const assetsById = useMemo(() => {
    const map = new Map<string, Asset>();
    assetsQuery.data?.forEach((asset) => map.set(asset.id, asset));
    return map;
  }, [assetsQuery.data]);

  const filteredOrders = useMemo(() => {
    const orders = filterWorkOrders(workOrdersQuery.data ?? [], filter);
    if (filter === 'ACTIVE') {
      return sortOrdersForCustomerHome(orders);
    }
    return [...orders].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [filter, workOrdersQuery.data]);

  return (
    <Screen>
      <AppTopBar title={strings.workOrders.myRepairs} />

      <ReportRepairButton />

      <WorkOrderFilterTabs value={filter} onChange={setFilter} />

      {workOrdersQuery.isLoading ? (
        <LoadingState />
      ) : workOrdersQuery.isError ? (
        <ErrorState
          message={strings.errors.loadRepairs}
          onRetry={() => workOrdersQuery.refetch()}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState title={strings.common.emptyTitle} description={strings.workOrders.noRepairs} />
      ) : (
        <View style={styles.list}>
          {filteredOrders.map((order) => (
            <WorkOrderCard
              key={order.id}
              variant="customer"
              order={order}
              asset={order.assetId ? assetsById.get(order.assetId) : undefined}
              showWorkOrderNumber={false}
              onPress={() => router.push(routes.customer.workOrderDetail(order.id))}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
