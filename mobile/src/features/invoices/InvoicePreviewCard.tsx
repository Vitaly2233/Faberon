import { StyleSheet, Text, View } from 'react-native';

import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import type { InvoicePreview } from '@/types/invoice';
import { formatIsoDate } from '@/utils/dates';
import { formatMoneyMinor } from '@/utils/money';
import { shouldShowItemizedInvoice } from '@/utils/invoice';

interface InvoicePreviewCardProps {
  invoice: InvoicePreview;
}

export function InvoicePreviewCard({ invoice }: InvoicePreviewCardProps) {
  const strings = useStrings();
  const showItems = shouldShowItemizedInvoice(invoice.displayMode);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.providerBlock}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{invoice.provider.name.slice(0, 1)}</Text>
          </View>
          <View style={styles.providerText}>
            <Text style={styles.providerName}>{invoice.provider.name}</Text>
            <Text style={styles.providerAddress}>{invoice.provider.address}</Text>
          </View>
        </View>
        <View style={styles.invoiceMeta}>
          <Text style={styles.invoiceTitle}>{strings.invoice.title}</Text>
          <Text style={styles.invoiceDate}>{formatIsoDate(invoice.issuedAt)}</Text>
        </View>
      </View>

      <View style={styles.billTo}>
        <Text style={styles.billToLabel}>{strings.invoice.billTo}</Text>
        <Text style={styles.billToName}>{invoice.billTo.companyName}</Text>
        <Text style={styles.billToAddress}>{invoice.billTo.address}</Text>
      </View>

      {showItems ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionCol]}>
              {strings.invoice.description}
            </Text>
            <Text style={[styles.tableHeaderCell, styles.amountCol]}>{strings.invoice.amount}</Text>
          </View>
          {invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCol]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.amountCol, styles.amountValue]}>
                {formatMoneyMinor(item.lineTotalMinor, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.totalOnlyHint}>{strings.invoice.totalOnlyHint}</Text>
      )}

      <Text style={styles.total}>
        {strings.invoice.totalDue}: {formatMoneyMinor(invoice.totalMinor, invoice.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.border.divider,
    backgroundColor: colors.background.surface,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  providerBlock: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.primary,
  },
  logoText: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
    color: colors.text.inverse,
  },
  providerText: {
    flex: 1,
    gap: spacing.xs,
  },
  providerName: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  providerAddress: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: 14,
    color: colors.text.tertiary,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  invoiceTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  invoiceDate: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  billTo: {
    gap: spacing.xs,
  },
  billToLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
  billToName: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  billToAddress: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: 14,
    color: colors.text.secondary,
  },
  table: {
    gap: spacing.xs,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.text.primary,
    paddingBottom: spacing.sm,
  },
  tableHeaderCell: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xs,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide * typography.size.xs,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.divider,
    paddingVertical: spacing.sm,
  },
  tableCell: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  descriptionCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  amountCol: {
    width: 96,
    textAlign: 'right',
  },
  amountValue: {
    fontFamily: typography.fontFamily.bold,
  },
  totalOnlyHint: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    fontStyle: 'italic',
    color: colors.text.tertiary,
  },
  total: {
    textAlign: 'right',
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.xl,
    color: colors.text.primary,
  },
});
