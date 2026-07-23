import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import type { PricingLineItem } from '@/types/pricing';
import { formatMoneyMinor } from '@/utils/money';

interface PricingSummaryProps {
  items: PricingLineItem[];
}

export function PricingSummary({ items }: PricingSummaryProps) {
  const strings = useStrings();
  if (items.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.row, index > 0 && styles.rowBorder]}>
          <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            {item.informationalOnly ? (
              <Text style={styles.tag}>{strings.technician.informationalOnly}</Text>
            ) : null}
            {!item.includeInInvoice ? (
              <Text style={styles.tag}>{strings.technician.invoiceHidden}</Text>
            ) : null}
          </View>
          <View style={styles.prices}>
            <Text style={styles.priceLabel}>
              {strings.technician.internalCost}: {formatMoneyMinor(item.internalCostMinor)}
            </Text>
            <Text style={styles.priceValue}>
              {strings.technician.customerPrice}: {formatMoneyMinor(item.customerPriceMinor)}
            </Text>
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
    padding: spacing.lg,
    gap: spacing.sm,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  content: {
    gap: spacing.xs,
  },
  name: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  tag: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  prices: {
    gap: spacing.xs,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  priceValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
});
