import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, shadows, spacing, typography } from '@/constants/tokens';
import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';
import { getAssetDisplayName } from '@/utils/assets';
import { getRepairContextLabel } from '@/utils/customer-work-orders';

interface ActiveRepairCardProps {
  order: WorkOrder;
  asset?: Asset;
  onPress: () => void;
}

export function ActiveRepairCard({ order, asset, onPress }: ActiveRepairCardProps) {
  const strings = useStrings();
  const deviceName = asset ? getAssetDisplayName(asset) : strings.workOrders.fields.notSpecified;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{deviceName}</Text>
        <StatusBadge stage={order.workflowStage} />
      </View>

      <Text style={styles.context} numberOfLines={2}>
        {getRepairContextLabel(order, asset)}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>{strings.workOrders.viewDetails}</Text>
        <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.5)" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    backgroundColor: colors.brand.primary,
    padding: spacing.xl,
    ...shadows.lg,
  },
  pressed: {
    opacity: 0.96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.inverse,
    letterSpacing: typography.letterSpacing.snug * typography.size['2xl'],
  },
  context: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.65)',
  },
  footer: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  footerHint: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.text.inverseMuted,
  },
});
