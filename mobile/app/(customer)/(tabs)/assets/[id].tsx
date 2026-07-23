import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { AssetRepairHistoryItem } from '@/features/assets/AssetRepairHistoryItem';
import { useStrings } from '@/hooks/use-i18n';
import { routes } from '@/constants/routes';
import { colors, radii, shadows, spacing, typography } from '@/constants/tokens';
import { useAssetQuery, useCustomerCompanyQuery, useWorkOrdersQuery } from '@/hooks/use-app-queries';
import {
  formatOwnershipType,
  getAssetDisplayName,
  getLatestMeterReading,
  getWorkOrdersForAsset,
} from '@/utils/assets';
import { formatIsoDate } from '@/utils/dates';

export default function CustomerAssetDetailScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const assetQuery = useAssetQuery(id ?? '');
  const companyQuery = useCustomerCompanyQuery();
  const workOrdersQuery = useWorkOrdersQuery();

  const repairHistory = useMemo(() => {
    if (!id) {
      return [];
    }
    return getWorkOrdersForAsset(workOrdersQuery.data ?? [], id);
  }, [id, workOrdersQuery.data]);

  if (!id) {
    return (
      <Screen>
        <ErrorState message={strings.errors.printerNotFound} onRetry={() => router.back()} />
      </Screen>
    );
  }

  if (assetQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (assetQuery.isError || !assetQuery.data) {
    return (
      <Screen>
        <ErrorState message={strings.errors.loadPrinter} onRetry={() => assetQuery.refetch()} />
      </Screen>
    );
  }

  const asset = assetQuery.data;
  const latestReading = getLatestMeterReading(asset);
  const address = asset.address ?? companyQuery.data?.defaultAddress ?? '';

  return (
    <Screen>
      <ScreenTopNav onBack={() => router.back()} />
      <Text style={styles.screenTitle}>{strings.assets.detailsTitle}</Text>

      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <View style={styles.heroIcon}>
            <Feather name="printer" size={22} color={colors.text.inverse} />
          </View>
          <Text style={styles.ownership}>{formatOwnershipType(asset.ownershipType)}</Text>
        </View>
        <Text style={styles.heroTitle}>{getAssetDisplayName(asset)}</Text>
        <Text style={styles.heroMeta}>
          {asset.assetType} · {asset.serialNumber}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Feather name="activity" size={17} color={colors.icon.default} />
          <Text style={styles.statValue}>
            {latestReading ? latestReading.value.toLocaleString() : '—'}
          </Text>
          <Text style={styles.statLabel}>{strings.assets.bwPages}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Feather name="shield" size={17} color={colors.icon.default} />
          <Text style={styles.statValueSmall}>
            {asset.warrantyEndDate ? formatIsoDate(asset.warrantyEndDate) : strings.assets.notCovered}
          </Text>
          <Text style={styles.statLabel}>{strings.assets.warrantyUntil}</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>{strings.assets.locationContact}</Text>
      <Card style={styles.infoCard}>
        <Text style={styles.infoRow}>
          <Feather name="map-pin" size={15} color={colors.icon.default} /> {address}
        </Text>
        {asset.primaryContactName ? (
          <Text style={[styles.infoRow, styles.infoBorder]}>
            <Feather name="user" size={15} color={colors.icon.default} /> {asset.primaryContactName}
          </Text>
        ) : null}
        {asset.assignedToCustomerDate ? (
          <Text style={[styles.infoRow, styles.infoBorder]}>
            {strings.assets.addedOn}: {formatIsoDate(asset.assignedToCustomerDate)}
          </Text>
        ) : null}
      </Card>

      <Text style={styles.sectionTitle}>{strings.assets.workOrdersForDevice}</Text>
      <View style={styles.history}>
        {repairHistory.length === 0 ? (
          <Text style={styles.emptyHistory}>{strings.assets.noWorkOrdersForDevice}</Text>
        ) : (
          repairHistory.map((order) => <AssetRepairHistoryItem key={order.id} order={order} />)
        )}
      </View>

      <AppButton
        label={strings.assets.requestService}
        onPress={() => router.push(routes.customer.workOrderCreateWithAsset(asset.id))}
        style={styles.requestButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  hero: {
    borderRadius: radii.card,
    backgroundColor: colors.brand.primary,
    padding: spacing.xl,
    ...shadows.lg,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.onDarkMuted,
    overflow: 'hidden',
  },
  ownership: {
    borderRadius: radii.pill,
    backgroundColor: colors.background.onDarkMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.inverse,
    textTransform: 'capitalize',
  },
  heroTitle: {
    marginTop: spacing.xl,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    lineHeight: typography.size['4xl'] * typography.lineHeight.snug,
    color: colors.text.inverse,
  },
  heroMeta: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.inverseMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    gap: spacing.sm,
  },
  statValue: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  statValueSmall: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  infoCard: {
    gap: spacing.md,
  },
  infoRow: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  infoBorder: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  history: {
    gap: spacing.sm,
  },
  emptyHistory: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  requestButton: {
    marginTop: spacing['2xl'],
  },
});
