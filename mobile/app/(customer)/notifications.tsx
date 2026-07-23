import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { NotificationCard } from '@/features/notifications/NotificationCard';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import { useMarkNotificationReadMutation, useMarkNotificationsReadMutation, useNotificationsQuery } from '@/hooks/use-app-queries';

export default function CustomerNotificationsScreen() {
  const strings = useStrings();
  const notificationsQuery = useNotificationsQuery();
  const markReadMutation = useMarkNotificationsReadMutation();
  const markOneReadMutation = useMarkNotificationReadMutation();
  const unreadCount = notificationsQuery.data?.filter((item) => !item.readAt).length ?? 0;

  return (
    <Screen>
      <ScreenBackButton onPress={() => router.back()} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{strings.notifications.title}</Text>
          {unreadCount > 0 ? (
            <Text style={styles.unreadBadge}>
              {unreadCount} {strings.notifications.unread}
            </Text>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" onPress={() => markReadMutation.mutate()}>
          <Text style={styles.markAll}>{strings.common.markAllRead}</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>{strings.notifications.recentUpdates}</Text>

      {notificationsQuery.isLoading ? (
        <LoadingState />
      ) : notificationsQuery.isError ? (
        <ErrorState
          message={strings.errors.loadNotifications}
          onRetry={() => notificationsQuery.refetch()}
        />
      ) : notificationsQuery.data?.length === 0 ? (
        <EmptyState title={strings.common.emptyTitle} description={strings.notifications.empty} />
      ) : (
        <View style={styles.list}>
          {notificationsQuery.data?.map((item, index) => (
            <NotificationCard
              key={item.id}
              item={item}
              highlighted={index === 0 && !item.readAt}
              onOpen={(notification) => {
                if (!notification.readAt) {
                  markOneReadMutation.mutate(notification.id);
                }
              }}
            />
          ))}
        </View>
      )}

      <AppButton
        label={strings.common.back}
        variant="secondary"
        onPress={() => router.back()}
        style={styles.backButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  unreadBadge: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.indicator.notification,
  },
  markAll: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  list: {
    gap: spacing.md,
  },
  backButton: {
    marginTop: spacing['2xl'],
  },
});
