import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { useStrings } from '@/hooks/use-i18n';
import { routes } from '@/constants/routes';
import { colors, radii, spacing, typography } from '@/constants/tokens';
import {
  useAssetsQuery,
  useCreateWorkOrderMutation,
  useCustomerCompanyQuery,
} from '@/hooks/use-app-queries';
import {
  createCustomerWorkOrderSchema,
  type CreateCustomerWorkOrderFormValues,
} from '@/schemas/work-order.schema';
import { getAssetDisplayName } from '@/utils/assets';

const OTHER_PRINTER = '__other__';

export default function CreateWorkOrderScreen() {
  const strings = useStrings();
  const { assetId: initialAssetId } = useLocalSearchParams<{ assetId?: string }>();
  const [selectedPrinter, setSelectedPrinter] = useState(initialAssetId ?? '');
  const [showNewPrinter, setShowNewPrinter] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const assetsQuery = useAssetsQuery();
  const companyQuery = useCustomerCompanyQuery();
  const createMutation = useCreateWorkOrderMutation();

  const defaultContact = companyQuery.data?.contacts.find((contact) => contact.isDefault);
  const defaultAddress = companyQuery.data?.defaultAddress ?? '';
  const defaultContactName = defaultContact?.name ?? '';
  const defaultContactPhone = defaultContact?.phone ?? '';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerWorkOrderFormValues>({
    resolver: zodResolver(createCustomerWorkOrderSchema),
    defaultValues: {
      assetId: initialAssetId,
      problemDescription: '',
      address: defaultAddress,
      contactPersonName: defaultContactName,
      contactPhone: defaultContactPhone,
    },
  });

  useEffect(() => {
    if (!companyQuery.data) {
      return;
    }
    const contact = companyQuery.data.contacts.find((item) => item.isDefault);
    reset({
      assetId: initialAssetId,
      problemDescription: '',
      address: companyQuery.data.defaultAddress,
      contactPersonName: contact?.name ?? '',
      contactPhone: contact?.phone ?? '',
    });
  }, [companyQuery.data, initialAssetId, reset]);

  const printerOptions = useMemo(() => assetsQuery.data ?? [], [assetsQuery.data]);

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateCustomerWorkOrderFormValues = {
      problemDescription: values.problemDescription,
      address: values.address,
      contactPersonName: values.contactPersonName,
      contactPhone: values.contactPhone,
      assetId: selectedPrinter && selectedPrinter !== OTHER_PRINTER ? selectedPrinter : undefined,
      newAsset:
        showNewPrinter && selectedPrinter === OTHER_PRINTER && values.newAsset
          ? {
              ...values.newAsset,
              ownershipType: values.newAsset.ownershipType ?? 'CUSTOMER_OWNED',
            }
          : undefined,
    };

    const order = await createMutation.mutateAsync(payload);
    setSubmitted(true);
    setTimeout(() => {
      router.replace(routes.customer.workOrderDetail(order.id));
    }, 900);
  });

  if (submitted) {
    return (
      <Screen contentStyle={styles.successContent}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconLabel}>✓</Text>
        </View>
        <Text style={styles.successTitle}>{strings.workOrders.createSuccessTitle}</Text>
        <Text style={styles.successMessage}>{strings.workOrders.createSuccessMessage}</Text>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTopNav onBack={() => router.back()} />
      <Text style={styles.kicker}>{strings.workOrders.createSubtitle}</Text>
      <Text style={styles.title}>{strings.workOrders.createTitle}</Text>

      <Text style={styles.fieldLabel}>{strings.workOrders.whichPrinter}</Text>
      <View style={styles.printerList}>
        {printerOptions.map((asset) => {
          const selected = selectedPrinter === asset.id;
          return (
            <Pressable
              key={asset.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                setSelectedPrinter(asset.id);
                setShowNewPrinter(false);
              }}
              style={[styles.printerChip, selected && styles.printerChipSelected]}
            >
              <Text style={[styles.printerChipLabel, selected && styles.printerChipLabelSelected]}>
                {getAssetDisplayName(asset)}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedPrinter === OTHER_PRINTER }}
          onPress={() => setSelectedPrinter(OTHER_PRINTER)}
          style={[
            styles.printerChip,
            selectedPrinter === OTHER_PRINTER && styles.printerChipSelected,
          ]}
        >
          <Text
            style={[
              styles.printerChipLabel,
              selectedPrinter === OTHER_PRINTER && styles.printerChipLabelSelected,
            ]}
          >
            {strings.workOrders.otherPrinter}
          </Text>
        </Pressable>
      </View>

      {selectedPrinter === OTHER_PRINTER ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowNewPrinter((value) => !value)}
          style={styles.toggleNewPrinter}
        >
          <Text style={styles.toggleNewPrinterLabel}>
            {showNewPrinter ? 'Hide printer details' : strings.workOrders.addNewPrinter}
          </Text>
        </Pressable>
      ) : null}

      {showNewPrinter && selectedPrinter === OTHER_PRINTER ? (
        <Card style={styles.newPrinterCard}>
          <Controller
            control={control}
            name="newAsset.assetType"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.assets.fields.type}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? 'printer'}
              />
            )}
          />
          <Controller
            control={control}
            name="newAsset.manufacturer"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.assets.fields.manufacturer}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
              />
            )}
          />
          <Controller
            control={control}
            name="newAsset.model"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.assets.fields.model}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
              />
            )}
          />
        </Card>
      ) : null}

      <Controller
        control={control}
        name="problemDescription"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.workOrders.fields.issue}
            multiline
            placeholder="Describe the issue, error message, or unusual behavior..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.problemDescription?.message}
            style={styles.textArea}
          />
        )}
      />

      <Card style={styles.defaultsCard}>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label={strings.workOrders.fields.address}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.address?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="contactPersonName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label={strings.profile.contactPerson}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.contactPersonName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="contactPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput label="Phone" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} />
          )}
        />
      </Card>

      <AppButton
        label={strings.workOrders.sendRequest}
        loading={createMutation.isPending}
        onPress={onSubmit}
      />
      <Text style={styles.hint}>{strings.workOrders.createEditHint}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  kicker: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight * typography.size['4xl'],
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.label,
    textTransform: 'uppercase',
  },
  printerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  printerChip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border.input,
    backgroundColor: colors.background.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  printerChipSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  printerChipLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  printerChipLabelSelected: {
    color: colors.text.inverse,
  },
  toggleNewPrinter: {
    alignSelf: 'flex-start',
  },
  toggleNewPrinterLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.sm,
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
  newPrinterCard: {
    gap: spacing.sm,
  },
  defaultsCard: {
    gap: spacing.sm,
  },
  textArea: {
    minHeight: 128,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  hint: {
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: 14,
    color: colors.text.tertiary,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing['3xl'],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.primary,
  },
  successIconLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 30,
    color: colors.text.inverse,
  },
  successTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['4xl'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  successMessage: {
    maxWidth: 260,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    lineHeight: 18,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
