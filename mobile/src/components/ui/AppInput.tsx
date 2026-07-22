import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, layout, radii, typography } from '@/constants/tokens';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function AppInput({ label, error, containerStyle, style, ...rest }: AppInputProps) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.text.placeholder}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.label,
  },
  input: {
    minHeight: layout.inputHeight,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border.input,
    backgroundColor: colors.background.surface,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.status.error.text,
  },
  error: {
    marginTop: 6,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.status.error.text,
  },
});
