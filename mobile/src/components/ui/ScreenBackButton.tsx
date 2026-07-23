import { Feather } from '@expo/vector-icons';
import { StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/constants/tokens';

interface ScreenBackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ScreenBackButton({ onPress, style }: ScreenBackButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, style]}>
      <Feather name="arrow-left" size={17} color={colors.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
    alignSelf: 'flex-start',
  },
});
