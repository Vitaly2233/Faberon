import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, typography } from '@/constants/tokens';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const strings = useStrings();
  const resolvedMessage = message ?? strings.common.loading;
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.brand.primary} />
      <Text style={styles.message}>{resolvedMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  message: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
});
