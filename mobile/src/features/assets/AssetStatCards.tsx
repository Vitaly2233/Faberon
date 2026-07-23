import { StyleSheet, Text, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';

interface AssetStatCardsProps {
  total: number;
  working: number;
}

export function AssetStatCards({ total, working }: AssetStatCardsProps) {
  const strings = useStrings();
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.totalCard]}>
        <Text style={styles.totalValue}>{total}</Text>
        <Text style={styles.totalLabel}>{strings.assets.totalDevices}</Text>
      </View>
      <View style={[styles.card, styles.workingCard]}>
        <Text style={styles.workingValue}>{working}</Text>
        <Text style={styles.workingLabel}>{strings.assets.workingWell}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  totalCard: {
    backgroundColor: colors.brand.primary,
  },
  workingCard: {
    backgroundColor: colors.status.working.background,
  },
  totalValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.inverse,
  },
  totalLabel: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.inverseMuted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
  workingValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.status.working.text,
  },
  workingLabel: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.status.working.text,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
});
