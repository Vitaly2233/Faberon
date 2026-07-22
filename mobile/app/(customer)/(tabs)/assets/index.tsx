import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppTopBar } from '@/components/navigation/AppTopBar';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { AssetCard } from '@/features/assets/AssetCard';
import { AssetStatCards } from '@/features/assets/AssetStatCards';
import { routes } from '@/constants/routes';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import { useAssetsQuery, useWorkOrdersQuery } from '@/hooks/use-app-queries';
import {
  countWorkingAssets,
  filterAssetsByQuery,
  getActiveWorkOrderForAsset,
} from '@/utils/assets';

export default function CustomerAssetsScreen() {
  const strings = useStrings();
  const [query, setQuery] = useState('');
  const assetsQuery = useAssetsQuery();
  const workOrdersQuery = useWorkOrdersQuery();

  const filteredAssets = useMemo(() => {
    return filterAssetsByQuery(assetsQuery.data ?? [], query);
  }, [assetsQuery.data, query]);

  return (
    <Screen>
      <AppTopBar title={strings.assets.title} />

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={strings.assets.searchPlaceholder}
          placeholderTextColor={colors.text.placeholder}
          style={styles.search}
        />
      </View>

      {assetsQuery.isLoading || workOrdersQuery.isLoading ? (
        <LoadingState />
      ) : assetsQuery.isError ? (
        <ErrorState message={strings.errors.loadPrinters} onRetry={() => assetsQuery.refetch()} />
      ) : (
        <>
          <AssetStatCards
            total={assetsQuery.data?.length ?? 0}
            working={countWorkingAssets(assetsQuery.data ?? [], workOrdersQuery.data ?? [])}
          />

          {filteredAssets.length === 0 ? (
            <EmptyState title={strings.common.emptyTitle} description={strings.assets.searchPlaceholder} />
          ) : (
            <View style={styles.list}>
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  activeOrder={getActiveWorkOrderForAsset(workOrdersQuery.data ?? [], asset.id)}
                  onPress={() => router.push(routes.customer.assetDetail(asset.id))}
                />
              ))}
            </View>
          )}

          <AppButton
            label={strings.assets.addPrinter}
            variant="secondary"
            onPress={() => router.push(routes.customer.assetCreate)}
            style={styles.addButton}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginBottom: spacing.lg,
  },
  search: {
    minHeight: 48,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border.input,
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.lg,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  list: {
    gap: spacing.md,
  },
  addButton: {
    marginTop: spacing.lg,
  },
});
