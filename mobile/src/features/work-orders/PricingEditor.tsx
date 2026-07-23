import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';
import {
  useDeletePricingLineItemMutation,
  useSavePricingLineItemMutation,
} from '@/hooks/use-app-queries';
import { pricingLineItemSchema, type PricingLineItemFormValues } from '@/schemas/pricing.schema';
import type { PricingLineItem } from '@/types/pricing';
import { formatMoneyMinor, moneyMinorToFormString } from '@/utils/money';

interface PricingEditorProps {
  workOrderId: string;
  items: PricingLineItem[];
}

const emptyValues: PricingLineItemFormValues = {
  name: '',
  quantity: 1,
  internalCost: '',
  customerPrice: '',
  includeInInvoice: true,
  informationalOnly: false,
};

function toFormValues(item: PricingLineItem): PricingLineItemFormValues {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    internalCost: moneyMinorToFormString(item.internalCostMinor),
    customerPrice: moneyMinorToFormString(item.customerPriceMinor),
    includeInInvoice: item.includeInInvoice,
    informationalOnly: item.informationalOnly,
  };
}

export function PricingEditor({ workOrderId, items }: PricingEditorProps) {
  const strings = useStrings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const saveMutation = useSavePricingLineItemMutation();
  const deleteMutation = useDeletePricingLineItemMutation();

  const form = useForm<PricingLineItemFormValues>({
    resolver: zodResolver(pricingLineItemSchema),
    defaultValues: emptyValues,
  });

  const startEdit = (item: PricingLineItem) => {
    setEditingId(item.id);
    form.reset(toFormValues(item));
  };

  const startCreate = () => {
    setEditingId('new');
    form.reset(emptyValues);
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.reset(emptyValues);
  };

  const submit = form.handleSubmit((values) => {
    saveMutation.mutate(
      { workOrderId, input: values },
      {
        onSuccess: () => {
          setEditingId(null);
          form.reset(emptyValues);
        },
      },
    );
  });

  return (
    <View style={styles.wrapper}>
      {items.length > 0 ? (
        <Card style={styles.listCard}>
          {items.map((item, index) => (
            <View key={item.id} style={[styles.row, index > 0 && styles.rowBorder]}>
              <View style={styles.rowContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {strings.technician.quantity}: {item.quantity}
                </Text>
                <Text style={styles.meta}>
                  {strings.technician.internalCost}: {formatMoneyMinor(item.internalCostMinor)}
                </Text>
                <Text style={styles.price}>
                  {strings.technician.customerPrice}: {formatMoneyMinor(item.customerPriceMinor)}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable accessibilityRole="button" onPress={() => startEdit(item)}>
                  <Text style={styles.action}>{strings.technician.editLineItem}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => deleteMutation.mutate({ workOrderId, lineItemId: item.id })}
                >
                  <Text style={styles.deleteAction}>{strings.technician.deleteLineItem}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      {editingId ? (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId === 'new' ? strings.technician.addLineItem : strings.technician.editLineItem}
          </Text>
          <Controller
            control={form.control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.technician.itemName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={form.formState.errors.name?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.technician.quantity}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(Number(text) || 0)}
                value={String(value ?? '')}
                error={form.formState.errors.quantity?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="internalCost"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.technician.internalCost}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={form.formState.errors.internalCost?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="customerPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.technician.customerPrice}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={form.formState.errors.customerPrice?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="includeInInvoice"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{strings.technician.includeInInvoice}</Text>
                <Switch
                  value={Boolean(value)}
                  onValueChange={onChange}
                  trackColor={{ false: colors.border.input, true: colors.brand.primary }}
                  thumbColor={colors.background.surface}
                />
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="informationalOnly"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{strings.technician.informationalOnly}</Text>
                <Switch
                  value={Boolean(value)}
                  onValueChange={onChange}
                  trackColor={{ false: colors.border.input, true: colors.brand.primary }}
                  thumbColor={colors.background.surface}
                />
              </View>
            )}
          />
          <AppButton
            label={strings.technician.saveLineItem}
            loading={saveMutation.isPending}
            onPress={submit}
          />
          <AppButton label={strings.technician.cancelEdit} variant="secondary" onPress={cancelEdit} />
        </Card>
      ) : (
        <AppButton label={strings.technician.addLineItem} variant="secondary" onPress={startCreate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
  rowContent: {
    gap: spacing.xs,
  },
  name: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  price: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  rowActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  action: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.brand.primary,
  },
  deleteAction: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    color: colors.text.destructive,
  },
  formCard: {
    gap: spacing.sm,
  },
  formTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.label,
  },
});
