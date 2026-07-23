import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { useStrings } from '@/hooks/use-i18n';
import { colors, typography } from '@/constants/tokens';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  const strings = useStrings();
  const resolvedTitle = title ?? strings.common.errorTitle;
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>{resolvedTitle}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <AppButton label={strings.common.retry} variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.status.error.background,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xl,
    color: colors.status.error.text,
  },
  message: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    lineHeight: 18,
    color: colors.status.error.text,
  },
});
