import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { StatusHeroCard } from '@/components/ui/StatusHeroCard';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import { PricingEditor } from '@/features/work-orders/PricingEditor';
import { PricingSummary } from '@/features/work-orders/PricingSummary';
import { RepairProgressTracker } from '@/features/work-orders/RepairProgressTracker';
import { ServiceDetailsCard } from '@/features/work-orders/ServiceDetailsCard';
import {
  useAddCommentMutation,
  useAdvanceStageMutation,
  useAssignWorkOrderMutation,
  useAssetsQuery,
  usePricingQuery,
  useSessionQuery,
  useUpdateEstimateMutation,
  useWorkOrderQuery,
} from '@/hooks/use-app-queries';
import { estimateChangeSchema, type EstimateChangeFormValues } from '@/schemas/auth.schema';
import { workOrderCommentSchema, type WorkOrderCommentFormValues } from '@/schemas/work-order.schema';
import {
  canTechnicianAdvanceStage,
  getNextWorkflowStage,
  normalizeWorkflowStage,
} from '@/utils/work-orders';

export default function TechnicianWorkOrderDetailScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionQuery = useSessionQuery();
  const workOrderQuery = useWorkOrderQuery(id ?? '');
  const assetsQuery = useAssetsQuery();
  const pricingQuery = usePricingQuery(id ?? '');
  const assignMutation = useAssignWorkOrderMutation();
  const advanceMutation = useAdvanceStageMutation();
  const estimateMutation = useUpdateEstimateMutation();
  const commentMutation = useAddCommentMutation();

  const estimateForm = useForm<EstimateChangeFormValues>({
    resolver: zodResolver(estimateChangeSchema),
    defaultValues: {
      estimatedCompletionDate: '',
      reason: '',
    },
  });

  const commentForm = useForm<WorkOrderCommentFormValues>({
    resolver: zodResolver(workOrderCommentSchema),
    defaultValues: {
      message: '',
      customerVisible: true,
    },
  });

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
  const technicianId = sessionQuery.data?.user.id;
  const isAssignedToMe = order.assignedTechnicianId === technicianId;
  const isUnassigned = !order.assignedTechnicianId;
  const nextStage = getNextWorkflowStage(order.workflowStage);
  const canAdvance = isAssignedToMe && canTechnicianAdvanceStage(order.workflowStage);

  const submitEstimate = estimateForm.handleSubmit((values) => {
    estimateMutation.mutate({ id: order.id, input: values });
  });

  const submitComment = commentForm.handleSubmit((values) => {
    commentMutation.mutate(
      { id: order.id, input: values },
      { onSuccess: () => commentForm.reset({ message: '', customerVisible: true }) },
    );
  });

  return (
    <Screen contentStyle={styles.content}>
      <ScreenBackButton onPress={() => router.back()} />

      <Text style={styles.title}>
        {strings.workOrders.workOrderLabel} #{order.number}
      </Text>
      <Text style={styles.subtitle}>
        {isUnassigned
          ? strings.technician.unassigned
          : isAssignedToMe
            ? strings.technician.assignedToYou
            : order.assignedTechnicianName}
      </Text>

      <StatusHeroCard
        kicker={strings.workOrders.currentStatus}
        title={strings.workflowStages[workflowStage]}
        iconName="tool"
        estimatedDate={order.estimatedCompletionDate}
        estimatedLabel={strings.workOrders.estimatedReady}
      />

      {isUnassigned ? (
        <AppButton
          label={strings.technician.assignToMe}
          loading={assignMutation.isPending}
          onPress={() => assignMutation.mutate(order.id)}
        />
      ) : null}

      {canAdvance && nextStage ? (
        <AppButton
          label={`${strings.technician.advanceStage}: ${strings.workflowStages[nextStage]}`}
          loading={advanceMutation.isPending}
          onPress={() => advanceMutation.mutate(order.id)}
        />
      ) : null}

      <Text style={styles.sectionTitle}>{strings.workOrders.repairProgress}</Text>
      <RepairProgressTracker stage={order.workflowStage} />

      <Text style={styles.sectionTitle}>{strings.workOrders.serviceDetails}</Text>
      <ServiceDetailsCard order={order} asset={asset} />

      {isAssignedToMe ? (
        <>
          <Text style={styles.sectionTitle}>{strings.technician.updateEstimate}</Text>
          <View style={styles.formBlock}>
            <Controller
              control={estimateForm.control}
              name="estimatedCompletionDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label={strings.workOrders.estimatedReady}
                  placeholder="2026-07-25"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={estimateForm.formState.errors.estimatedCompletionDate?.message}
                />
              )}
            />
            <Controller
              control={estimateForm.control}
              name="reason"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Reason"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={estimateForm.formState.errors.reason?.message}
                />
              )}
            />
            <AppButton
              label={strings.technician.updateEstimate}
              variant="secondary"
              loading={estimateMutation.isPending}
              onPress={submitEstimate}
            />
          </View>

          <Text style={styles.sectionTitle}>{strings.technician.addComment}</Text>
          <View style={styles.formBlock}>
            <Controller
              control={commentForm.control}
              name="message"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label={strings.technician.addComment}
                  multiline
                  placeholder={strings.technician.commentPlaceholder}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={commentForm.formState.errors.message?.message}
                  style={styles.textArea}
                />
              )}
            />
            <Controller
              control={commentForm.control}
              name="customerVisible"
              render={({ field: { onChange, value } }) => (
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{strings.technician.customerVisible}</Text>
                  <Switch
                    value={Boolean(value)}
                    onValueChange={onChange}
                    trackColor={{ false: colors.border.input, true: colors.brand.primary }}
                    thumbColor={colors.background.surface}
                  />
                </View>
              )}
            />
            <AppButton
              label={strings.technician.addComment}
              variant="secondary"
              loading={commentMutation.isPending}
              onPress={submitComment}
            />
          </View>
        </>
      ) : null}

      {isAssignedToMe ? (
        <>
          <Text style={styles.sectionTitle}>{strings.technician.pricing}</Text>
          <PricingEditor workOrderId={order.id} items={pricingQuery.data ?? []} />
        </>
      ) : pricingQuery.data && pricingQuery.data.length > 0 ? (
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
  formBlock: {
    gap: spacing.sm,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.label,
  },
  timeline: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
});
