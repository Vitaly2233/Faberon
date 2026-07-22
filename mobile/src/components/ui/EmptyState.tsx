import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/constants/tokens';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background.muted,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    lineHeight: 18,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
