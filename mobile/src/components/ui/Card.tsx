import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/constants/tokens';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function Card({ style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
});
