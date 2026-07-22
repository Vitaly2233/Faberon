import { StyleSheet, View } from 'react-native';

import { NotificationBellButton } from '@/components/navigation/NotificationBellButton';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { spacing } from '@/constants/tokens';

interface ScreenTopNavProps {
  onBack: () => void;
}

export function ScreenTopNav({ onBack }: ScreenTopNavProps) {
  return (
    <View style={styles.row}>
      <ScreenBackButton onPress={onBack} style={styles.backButton} />
      <NotificationBellButton />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 0,
  },
});
