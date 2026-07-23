import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, shadows, spacing, typography } from '@/constants/tokens';
import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';
import { formatOwnershipType, getAssetDisplayName } from '@/utils/assets';

interface AssetCardProps {
  asset: Asset;
  activeOrder?: WorkOrder;
  onPress: () => void;
}

export function AssetCard({ asset, activeOrder, onPress }: AssetCardProps) {
  const strings = useStrings();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather name="printer" size={21} color={colors.text.primary} />
        </View>
        {activeOrder ? (
          <StatusBadge stage={activeOrder.workflowStage} />
        ) : (
          <View style={styles.workingBadge}>
            <Text style={styles.workingLabel}>{strings.assets.workingStatus}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{getAssetDisplayName(asset)}</Text>
      <Text style={styles.meta}>
        {asset.assetType} · {asset.serialNumber}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={13} color={colors.text.muted} />
          <Text style={styles.location} numberOfLines={1}>
            {asset.primaryContactName ?? formatOwnershipType(asset.ownershipType)}
          </Text>
        </View>
        <Feather name="chevron-right" size={15} color={colors.text.tertiary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    padding: spacing.lg,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.muted,
  },
  workingBadge: {
    borderRadius: radii.pill,
    backgroundColor: colors.status.working.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  workingLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xs,
    color: colors.status.working.text,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
  meta: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.muted,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  locationRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  location: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
});
