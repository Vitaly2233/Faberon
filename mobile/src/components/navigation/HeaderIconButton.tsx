import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/constants/tokens';
import type { ComponentProps } from 'react';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

interface HeaderIconButtonProps {
  icon: FeatherIconName;
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function HeaderIconButton({
  icon,
  accessibilityLabel,
  onPress,
  style,
}: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Feather name={icon} size={17} color={colors.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
});
