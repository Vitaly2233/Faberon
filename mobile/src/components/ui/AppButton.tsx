import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, layout, radii, typography } from '@/constants/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.text.inverse : colors.text.primary} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as const]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.brand.primary,
  },
  secondary: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.input,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.strong,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
  },
  primaryLabel: {
    color: colors.text.inverse,
  },
  secondaryLabel: {
    color: colors.text.primary,
  },
  ghostLabel: {
    color: colors.text.primary,
  },
  destructiveLabel: {
    color: colors.text.destructive,
  },
});
