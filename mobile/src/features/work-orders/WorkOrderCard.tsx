import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { useI18n, useStrings } from '@/hooks/use-i18n';
import { colors, radii, shadows, spacing, typography } from '@/constants/tokens';
import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';
import { getAssetDisplayName } from '@/utils/assets';
import { getRepairContextLabel } from '@/utils/customer-work-orders';
import { formatIsoDate } from '@/utils/dates';

interface WorkOrderCardProps {
  order: WorkOrder;
  asset?: Asset;
  onPress: () => void;
  showWorkOrderNumber?: boolean;
  variant?: 'customer' | 'staff';
}

export function WorkOrderCard({
  order,
  asset,
  onPress,
  showWorkOrderNumber = true,
  variant = 'staff',
}: WorkOrderCardProps) {
  const strings = useStrings();
  const { dateLocale } = useI18n();
  const isCustomer = variant === 'customer';
  const deviceName = asset ? getAssetDisplayName(asset) : strings.workOrders.fields.notSpecified;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        {isCustomer ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Text style={styles.label}>
            {showWorkOrderNumber ? (
              <>
                {strings.workOrders.workOrderLabel.toUpperCase()}{' '}
                <Text style={styles.number}>#{order.number}</Text>
              </>
            ) : (
              strings.workOrders.activeRepair
            )}
          </Text>
        )}
        <StatusBadge stage={order.workflowStage} />
      </View>

      <Text style={styles.title}>{deviceName}</Text>

      {isCustomer ? (
        <Text style={styles.context} numberOfLines={2}>
          {getRepairContextLabel(order, asset)}
        </Text>
      ) : (
        <Text style={styles.description} numberOfLines={2}>
          {order.problemDescription}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>{formatIsoDate(order.createdAt, dateLocale)}</Text>
        <View style={styles.linkRow}>
          <Text style={styles.link}>{strings.workOrders.viewDetails}</Text>
          <Feather name="chevron-right" size={13} color={colors.text.tertiary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    padding: spacing.lg,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerSpacer: {
    flex: 1,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  number: {
    color: colors.text.primary,
  },
  title: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  context: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  description: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  link: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
