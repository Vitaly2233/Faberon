import { Alert, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { InvoicePreviewCard } from '@/features/invoices/InvoicePreviewCard';
import { useInvoicePreviewQuery } from '@/hooks/use-app-queries';

export default function CustomerInvoicePreviewScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoiceQuery = useInvoicePreviewQuery(id ?? '');

  if (!id) {
    return (
      <Screen>
        <ErrorState message={strings.errors.workOrderNotFound} onRetry={() => router.back()} />
      </Screen>
    );
  }

  if (invoiceQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (invoiceQuery.isError || !invoiceQuery.data) {
    return (
      <Screen>
        <ScreenTopNav onBack={() => router.back()} />
        <ErrorState message={strings.errors.loadInvoice} onRetry={() => invoiceQuery.refetch()} />
      </Screen>
    );
  }

  const handleExportPdf = () => {
    Alert.alert(strings.invoice.exportTitle, strings.invoice.exportMessage);
  };

  return (
    <Screen>
      <ScreenTopNav onBack={() => router.back()} />
      <Text style={styles.title}>{strings.invoice.previewTitle}</Text>
      <Text style={styles.subtitle}>{strings.invoice.previewSubtitle}</Text>

      <InvoicePreviewCard invoice={invoiceQuery.data} />

      <AppButton
        label={strings.invoice.exportPdf}
        onPress={handleExportPdf}
        style={styles.exportButton}
      />
      <AppButton label={strings.common.close} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 18,
    color: colors.text.muted,
  },
  exportButton: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
});
