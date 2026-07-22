import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { WORKFLOW_STAGES, getWorkflowStageIndex, normalizeWorkflowStage, type LegacyRepairWorkflowStage } from '@/utils/work-orders';

interface RepairProgressTrackerProps {
  stage: LegacyRepairWorkflowStage;
}

export function RepairProgressTracker({ stage }: RepairProgressTrackerProps) {
  const strings = useStrings();
  const normalizedStage = normalizeWorkflowStage(stage);
  const stageIndex = getWorkflowStageIndex(normalizedStage);

  return (
    <Card style={styles.card}>
      {WORKFLOW_STAGES.map((item, index) => {
        const done = index <= stageIndex;
        const current = index === stageIndex;

        return (
          <View key={item} style={styles.step}>
            <View style={styles.markerColumn}>
              <View style={[styles.marker, done && styles.markerDone]}>
                {done ? <Feather name="check" size={12} color={colors.text.inverse} /> : null}
              </View>
              {index < WORKFLOW_STAGES.length - 1 ? (
                <View style={[styles.line, index < stageIndex && styles.lineDone]} />
              ) : null}
            </View>
            <View style={styles.content}>
              <Text style={[styles.label, !done && styles.labelPending]}>
                {strings.workflowStages[item]}
              </Text>
              {current ? (
                <Text style={styles.hint}>{strings.workOrders.stageCurrentHint}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 0,
    paddingVertical: spacing.xl,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 48,
  },
  markerColumn: {
    width: 24,
    alignItems: 'center',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.border.strong,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDone: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: spacing.xs,
    backgroundColor: colors.border.strong,
  },
  lineDone: {
    backgroundColor: colors.brand.primary,
  },
  content: {
    flex: 1,
    paddingBottom: spacing['2xl'],
  },
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  labelPending: {
    color: colors.text.tertiary,
  },
  hint: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: 14,
    color: colors.text.muted,
  },
});
