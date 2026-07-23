import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';

interface ServiceDetailsCardProps {
  order: WorkOrder;
  asset?: Asset;
}

export function ServiceDetailsCard({ order, asset }: ServiceDetailsCardProps) {
  const strings = useStrings();
  const rows = [
    {
      icon: 'printer' as const,
      label: strings.workOrders.fields.device,
      value: asset ? `${asset.manufacturer} ${asset.model}` : strings.workOrders.fields.notSpecified,
    },
    {
      icon: 'file-text' as const,
      label: strings.workOrders.fields.issue,
      value: order.problemDescription,
    },
    {
      icon: 'map-pin' as const,
      label: strings.workOrders.fields.address,
      value: order.address,
    },
  ];

  return (
    <Card style={styles.card}>
      {rows.map((row, index) => (
        <View key={row.label} style={[styles.row, index > 0 && styles.rowBorder]}>
          <Feather name={row.icon} size={16} color={colors.icon.default} style={styles.icon} />
          <View style={styles.content}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  icon: {
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
  value: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.label,
  },
});
