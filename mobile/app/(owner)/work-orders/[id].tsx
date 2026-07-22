import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { StatusHeroCard } from '@/components/ui/StatusHeroCard';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { PricingSummary } from '@/features/work-orders/PricingSummary';
import { RepairProgressTracker } from '@/features/work-orders/RepairProgressTracker';
import { ServiceDetailsCard } from '@/features/work-orders/ServiceDetailsCard';
import { useAssetsQuery, usePricingQuery, useWorkOrderQuery } from '@/hooks/use-app-queries';
import { normalizeWorkflowStage } from '@/utils/work-orders';

export default function OwnerWorkOrderDetailScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workOrderQuery = useWorkOrderQuery(id ?? '');
  const assetsQuery = useAssetsQuery();
  const pricingQuery = usePricingQuery(id ?? '');

  const asset = useMemo(() => {
    const assetId = workOrderQuery.data?.assetId;
    if (!assetId) {
      return undefined;
    }
    return assetsQuery.data?.find((item) => item.id === assetId);
  }, [assetsQuery.data, workOrderQuery.data?.assetId]);

  const timeline = useMemo(() => {
    if (!workOrderQuery.data) {
      return [];
    }
    return [...workOrderQuery.data.timeline].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt),
    );
  }, [workOrderQuery.data]);

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
        <ErrorState message={strings.errors.loadWorkOrder} onRetry={() => workOrderQuery.refetch()} />
      </Screen>
    );
  }

  const order = workOrderQuery.data;
  const workflowStage = normalizeWorkflowStage(order.workflowStage);

  return (
    <Screen contentStyle={styles.content}>
      <ScreenBackButton onPress={() => router.back()} />

      <Text style={styles.title}>
        {strings.workOrders.workOrderLabel} #{order.number}
      </Text>
      <Text style={styles.subtitle}>
        {order.customerName}
        {order.assignedTechnicianName ? ` · ${order.assignedTechnicianName}` : ` · ${strings.technician.unassigned}`}
      </Text>

      <StatusHeroCard
        kicker={strings.workOrders.currentStatus}
        title={strings.workflowStages[workflowStage]}
        iconName="tool"
        estimatedDate={order.estimatedCompletionDate}
        estimatedLabel={strings.workOrders.estimatedReady}
      />

      <Text style={styles.sectionTitle}>{strings.workOrders.repairProgress}</Text>
      <RepairProgressTracker stage={order.workflowStage} />

      <Text style={styles.sectionTitle}>{strings.workOrders.serviceDetails}</Text>
      <ServiceDetailsCard order={order} asset={asset} />

      {pricingQuery.data && pricingQuery.data.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>{strings.technician.pricing}</Text>
          <PricingSummary items={pricingQuery.data} />
        </>
      ) : null}

      <Text style={styles.sectionTitle}>{strings.workOrders.updates}</Text>
      <View style={styles.timeline}>
        {timeline.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLast={index === timeline.length - 1} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  title: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  timeline: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
});
