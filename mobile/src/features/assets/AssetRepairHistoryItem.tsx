import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { routes } from '@/constants/routes';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useI18n } from '@/hooks/use-i18n';
import type { WorkOrder } from '@/types/work-order';
import { formatIsoDate } from '@/utils/dates';

interface AssetRepairHistoryItemProps {
  order: WorkOrder;
}

export function AssetRepairHistoryItem({ order }: AssetRepairHistoryItemProps) {
  const { dateLocale } = useI18n();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(routes.customer.workOrderDetail(order.id))}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Feather name="tool" size={17} color={colors.text.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {order.problemDescription}
        </Text>
        <Text style={styles.date}>{formatIsoDate(order.createdAt, dateLocale)}</Text>
      </View>
      <StatusBadge stage={order.workflowStage} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.96,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  date: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
