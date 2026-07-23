import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, radii } from '@/constants/tokens';
import { useNotificationsQuery } from '@/hooks/use-app-queries';

interface NotificationBellButtonProps {
  onPress?: () => void;
}

export function NotificationBellButton({ onPress }: NotificationBellButtonProps) {
  const strings = useStrings();
  const notificationsQuery = useNotificationsQuery();
  const unreadCount = notificationsQuery.data?.filter((item) => !item.readAt).length ?? 0;

  const handlePress = onPress ?? (() => router.push('/(customer)/notifications'));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.tabs.notifications}
      onPress={handlePress}
      style={styles.button}
    >
      <Feather name="bell" size={17} color={colors.text.primary} />
      {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
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
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.indicator.notification,
    borderWidth: 2,
    borderColor: colors.background.muted,
  },
});
