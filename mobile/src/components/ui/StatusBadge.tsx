import { StyleSheet, Text, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, typography } from '@/constants/tokens';
import type { RepairWorkflowStage } from '@/types/work-order';
import { normalizeWorkflowStage, type LegacyRepairWorkflowStage } from '@/utils/work-orders';

const stageStyles: Record<
  RepairWorkflowStage,
  { backgroundColor: string; color: string }
> = {
  WAITING: {
    backgroundColor: colors.status.waiting.background,
    color: colors.status.waiting.text,
  },
  TRAVEL_AND_DIAGNOSIS: {
    backgroundColor: colors.status.travel.background,
    color: colors.status.travel.text,
  },
  WAITING_FOR_PARTS: {
    backgroundColor: colors.status.parts.background,
    color: colors.status.parts.text,
  },
  REPAIRED: {
    backgroundColor: colors.status.repaired.background,
    color: colors.status.repaired.text,
  },
};

interface StatusBadgeProps {
  stage: LegacyRepairWorkflowStage;
}

export function StatusBadge({ stage }: StatusBadgeProps) {
  const strings = useStrings();
  const normalizedStage = normalizeWorkflowStage(stage);
  const label = strings.workflowStages[normalizedStage];
  const palette = stageStyles[normalizedStage];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      style={[styles.badge, { backgroundColor: palette.backgroundColor }]}
    >
      <Text style={[styles.label, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xs,
    textTransform: 'uppercase',
  },
});
