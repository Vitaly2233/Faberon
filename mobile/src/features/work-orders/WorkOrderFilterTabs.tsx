import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import type { WorkOrderFilter } from '@/utils/work-orders';

interface WorkOrderFilterTabsProps {
  value: WorkOrderFilter;
  onChange: (value: WorkOrderFilter) => void;
}

const filters: WorkOrderFilter[] = ['ACTIVE', 'COMPLETED', 'ALL'];

export function WorkOrderFilterTabs({ value, onChange }: WorkOrderFilterTabsProps) {
  const strings = useStrings();
  const filterLabels: Record<WorkOrderFilter, string> = {
    ALL: strings.workOrders.filters.all,
    ACTIVE: strings.workOrders.filters.active,
    COMPLETED: strings.workOrders.filters.completed,
  };
  return (
    <View style={styles.row}>
      {filters.map((filter) => {
        const selected = value === filter;
        return (
          <Pressable
            key={filter}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{filterLabels[filter]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    borderRadius: radii.pill,
    backgroundColor: colors.background.muted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.brand.primary,
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  labelSelected: {
    fontFamily: typography.fontFamily.black,
    color: colors.text.inverse,
  },
});
