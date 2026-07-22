import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SUPPORTED_LOCALES } from '@/constants/i18n';
import type { AppLocale } from '@/constants/i18n/types';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useI18n } from '@/hooks/use-i18n';

const LOCALE_LABEL_KEYS: Record<AppLocale, 'english' | 'polish'> = {
  en: 'english',
  pl: 'polish',
};

export function LanguagePicker() {
  const { locale, setLocale, strings } = useI18n();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{strings.profile.language}</Text>
      <Text style={styles.subtitle}>{strings.profile.languageSubtitle}</Text>
      <Card style={styles.card}>
        {SUPPORTED_LOCALES.map((option, index) => {
          const selected = locale === option;
          const labelKey = LOCALE_LABEL_KEYS[option];

          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setLocale(option)}
              style={[styles.option, index > 0 && styles.optionBorder]}
            >
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {strings.profile[labelKey]}
              </Text>
              {selected ? <View style={styles.selectedDot} /> : null}
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 18,
    color: colors.text.muted,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  option: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  optionLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  optionLabelSelected: {
    fontFamily: typography.fontFamily.black,
    color: colors.text.primary,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.brand.primary,
  },
});
