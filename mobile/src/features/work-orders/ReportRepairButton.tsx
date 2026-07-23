import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { routes } from '@/constants/routes';
import { colors, radii, shadows, spacing, typography } from '@/constants/tokens';
import { useStrings } from '@/hooks/use-i18n';

export function ReportRepairButton() {
  const strings = useStrings();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.home.reportRepair}
      onPress={() => router.push(routes.customer.workOrderCreate)}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Feather name="plus" size={22} color={colors.text.inverse} />
      <Text style={styles.label}>{strings.home.reportRepair}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.xl,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...shadows.md,
  },
  buttonPressed: {
    opacity: 0.96,
  },
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
    color: colors.text.inverse,
  },
});
