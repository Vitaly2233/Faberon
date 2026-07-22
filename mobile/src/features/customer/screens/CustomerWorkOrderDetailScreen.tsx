import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { Screen } from '@/components/ui/Screen';
import { StatusHeroCard } from '@/components/ui/StatusHeroCard';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { routes } from '@/constants/routes';
import { spacing, typography, colors } from '@/constants/tokens';
import { RepairProgressTracker } from '@/features/work-orders/RepairProgressTracker';
import { ServiceDetailsCard } from '@/features/work-orders/ServiceDetailsCard';
import { useStrings } from '@/hooks/use-i18n';
import { useAssetsQuery, useWorkOrderQuery } from '@/hooks/use-app-queries';
import { canCustomerEditWorkOrder, canCustomerViewInvoice } from '@/utils/permissions';
import { getAssetDisplayName } from '@/utils/assets';
import { getCustomerVisibleTimeline, normalizeWorkflowStage } from '@/utils/work-orders';

export function CustomerWorkOrderDetailScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workOrderQuery = useWorkOrderQuery(id ?? '');
  const assetsQuery = useAssetsQuery();

  const asset = useMemo(() => {
    const assetId = workOrderQuery.data?.assetId;
    if (!assetId) {
      return undefined;
    }
    return assetsQuery.data?.find((item) => item.id === assetId);
  }, [assetsQuery.data, workOrderQuery.data?.assetId]);

  const timeline = useMemo(
    () => (workOrderQuery.data ? getCustomerVisibleTimeline(workOrderQuery.data) : []),
    [workOrderQuery.data],
  );

  if (!id) {
    return (
      <Screen>
        <ErrorState message={strings.errors.workOrderNotFound} onRetry={() => router.back()} />
      </Screen>
    );
  }

  if (workOrderQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (workOrderQuery.isError || !workOrderQuery.data) {
    return (
      <Screen>
        <ErrorState
          message={strings.errors.loadWorkOrder}
          onRetry={() => workOrderQuery.refetch()}
        />
      </Screen>
    );
  }

  const order = workOrderQuery.data;
  const canEdit = canCustomerEditWorkOrder(order);
  const canViewInvoice = canCustomerViewInvoice(order);
  const workflowStage = normalizeWorkflowStage(order.workflowStage);
  const isComplete = workflowStage === 'REPAIRED';

  return (
    <Screen>
      <ScreenTopNav onBack={() => router.back()} />

      <Text style={styles.screenTitle}>
        {asset ? getAssetDisplayName(asset) : strings.workOrders.activeRepair}
      </Text>

      <StatusHeroCard
        kicker={strings.workOrders.currentStatus}
        title={strings.workflowStages[workflowStage]}
        iconName={isComplete ? 'check-circle' : 'tool'}
        estimatedDate={order.estimatedCompletionDate}
        estimatedLabel={strings.workOrders.estimatedReady}
      />

      <Text style={styles.sectionTitle}>{strings.workOrders.repairProgress}</Text>
      <RepairProgressTracker stage={order.workflowStage} />

      <Text style={styles.sectionTitle}>{strings.workOrders.serviceDetails}</Text>
      <ServiceDetailsCard order={order} asset={asset} />

      <Text style={styles.sectionTitle}>{strings.workOrders.updates}</Text>
      <View style={styles.timeline}>
        {timeline.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLast={index === timeline.length - 1} />
        ))}
      </View>

      {canEdit ? (
        <View style={styles.editBlock}>
          <AppButton
            label={strings.workOrders.editRequest}
            variant="secondary"
            onPress={() => router.push(routes.customer.workOrderEdit(order.id))}
          />
        </View>
      ) : null}

      {canViewInvoice ? (
        <View style={styles.invoiceBlock}>
          <AppButton
            label={strings.invoice.viewPreview}
            variant="secondary"
            onPress={() => router.push(routes.customer.workOrderInvoice(order.id))}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  sectionTitle: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  timeline: {
    gap: spacing.sm,
  },
  editBlock: {
    marginTop: spacing['2xl'],
  },
  invoiceBlock: {
    marginTop: spacing['2xl'],
  },
});
