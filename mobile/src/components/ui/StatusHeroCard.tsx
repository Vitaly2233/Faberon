import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useI18n } from '@/hooks/use-i18n';
import { formatIsoDate } from '@/utils/dates';

interface StatusHeroCardProps {
  kicker: string;
  title: string;
  iconName: keyof typeof Feather.glyphMap;
  estimatedDate?: string;
  estimatedLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatusHeroCard({
  kicker,
  title,
  iconName,
  estimatedDate,
  estimatedLabel,
  style,
}: StatusHeroCardProps) {
  const { dateLocale } = useI18n();
  return (
    <View style={[styles.hero, style]} collapsable={false}>
      <View style={styles.heroHeader}>
        <View style={styles.heroText}>
          <Text style={styles.heroKicker}>{kicker}</Text>
          <Text style={styles.heroTitle}>{title}</Text>
        </View>
        <View style={styles.heroIcon} collapsable={false}>
          <Feather name={iconName} size={20} color={colors.text.inverse} />
        </View>
      </View>

      {estimatedDate && estimatedLabel ? (
        <View style={styles.estimateRow} collapsable={false}>
          <Feather name="calendar" size={15} color={colors.text.inverseMuted} />
          <Text style={styles.estimateLabel}>{estimatedLabel}</Text>
          <Text style={styles.estimateValue}>{formatIsoDate(estimatedDate, dateLocale)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.card,
    backgroundColor: colors.brand.primary,
    padding: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroText: {
    flex: 1,
  },
  heroKicker: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.inverseMuted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider * typography.size.xs,
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.inverse,
    letterSpacing: typography.letterSpacing.snug * typography.size['4xl'],
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.onDarkMuted,
    overflow: 'hidden',
  },
  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.xl,
    backgroundColor: colors.background.onDarkSubtle,
    padding: spacing.md,
    overflow: 'hidden',
  },
  estimateLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.inverseMuted,
  },
  estimateValue: {
    marginLeft: 'auto',
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.inverse,
  },
});
