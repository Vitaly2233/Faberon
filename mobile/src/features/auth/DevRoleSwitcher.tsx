import { Pressable, StyleSheet, Text, View } from 'react-native';

import { USER_ROLES, type UserRole } from '@/constants/roles';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useDevAuthStore } from '@/features/auth/dev-auth.store';

const roleLabels: Record<UserRole, string> = {
  CUSTOMER: 'Customer',
  TECHNICIAN: 'Technician',
  OWNER: 'Owner',
};

export function DevRoleSwitcher() {
  const strings = useStrings();
  const devRole = useDevAuthStore((state) => state.devRole);
  const setDevRole = useDevAuthStore((state) => state.setDevRole);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{strings.auth.devRoleSwitcher}</Text>
      <View style={styles.row}>
        {USER_ROLES.map((role) => {
          const selected = devRole === role;
          return (
            <Pressable
              key={role}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setDevRole(role)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {roleLabels[role]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.input,
    backgroundColor: colors.background.surface,
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
  chipSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  chipLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  chipLabelSelected: {
    color: colors.text.inverse,
  },
});
