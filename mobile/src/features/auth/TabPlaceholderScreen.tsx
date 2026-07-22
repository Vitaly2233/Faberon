import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/tokens';

interface TabPlaceholderScreenProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function TabPlaceholderScreen({ title, description, children }: TabPlaceholderScreenProps) {
  return (
    <Screen contentStyle={children ? styles.content : undefined}>
      <Text style={styles.title}>{title}</Text>
      <Card style={styles.card}>
        <Text style={styles.description}>{description}</Text>
      </Card>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  title: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.snug * typography.size['3xl'],
  },
  card: {
    gap: spacing.sm,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});
