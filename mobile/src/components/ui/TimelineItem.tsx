import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/constants/tokens';
import { useI18n } from '@/hooks/use-i18n';
import type { TimelineEvent } from '@/types/work-order';
import { formatIsoDateTime } from '@/utils/dates';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast?: boolean;
}

export function TimelineItem({ event, isLast = false }: TimelineItemProps) {
  const { dateLocale } = useI18n();
  return (
    <View style={styles.row}>
      <View style={styles.markerColumn}>
        <View style={styles.marker} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.meta}>
          {event.authorName} · {formatIsoDateTime(event.occurredAt, dateLocale)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  markerColumn: {
    alignItems: 'center',
    width: 16,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.brand.primary,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.border.default,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  description: {
    marginTop: 4,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  meta: {
    marginTop: 6,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
});
