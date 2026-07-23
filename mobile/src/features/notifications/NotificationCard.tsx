import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n, useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { getNotificationIcon } from '@/features/notifications/notification-icons';
import { openNotificationTarget } from '@/features/notifications/notification-navigation';
import type { NotificationItem } from '@/types/notification';
import { formatIsoDateTime } from '@/utils/dates';

interface NotificationCardProps {
  item: NotificationItem;
  highlighted?: boolean;
  onOpen?: (item: NotificationItem) => void;
}

export function NotificationCard({ item, highlighted = false, onOpen }: NotificationCardProps) {
  const strings = useStrings();
  const { dateLocale } = useI18n();
  const unread = !item.readAt;
  const iconName = getNotificationIcon(item.type);

  const handlePress = () => {
    onOpen?.(item);
    openNotificationTarget(item);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={[styles.card, highlighted ? styles.cardHighlighted : styles.cardMuted]}
    >
      <View style={styles.iconWrap}>
        <Feather name={iconName} size={16} color={colors.text.primary} />
        {unread ? <View style={styles.unreadDot} /> : null}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title || strings.notifications.repairUpdate}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.meta}>{formatIsoDateTime(item.createdAt, dateLocale)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardHighlighted: {
    borderColor: colors.border.strong,
    backgroundColor: colors.background.surface,
  },
  cardMuted: {
    borderColor: 'transparent',
    backgroundColor: colors.background.muted,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.indicator.notification,
    borderWidth: 2,
    borderColor: colors.background.surface,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  body: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  meta: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
});
