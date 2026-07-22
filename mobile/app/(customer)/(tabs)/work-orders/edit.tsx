import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { useUpdateCustomerWorkOrderMutation, useWorkOrderQuery } from '@/hooks/use-app-queries';
import {
  updateCustomerWorkOrderSchema,
  type UpdateCustomerWorkOrderFormValues,
} from '@/schemas/work-order.schema';
import { canCustomerEditWorkOrder } from '@/utils/permissions';

export default function EditCustomerWorkOrderScreen() {
  const strings = useStrings();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const workOrderQuery = useWorkOrderQuery(id ?? '');
  const updateMutation = useUpdateCustomerWorkOrderMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerWorkOrderFormValues>({
    resolver: zodResolver(updateCustomerWorkOrderSchema),
    defaultValues: {
      problemDescription: '',
      address: '',
      contactPersonName: '',
      contactPhone: '',
    },
  });

  useEffect(() => {
    if (!workOrderQuery.data) {
      return;
    }
    reset({
      problemDescription: workOrderQuery.data.problemDescription,
      address: workOrderQuery.data.address,
      contactPersonName: workOrderQuery.data.contactPersonName,
      contactPhone: workOrderQuery.data.contactPhone ?? '',
    });
  }, [reset, workOrderQuery.data]);

  if (!id) {
    return (
      <Screen>
        <ErrorState message={strings.errors.workOrderNotFound} onRetry={() => router.back()} />
      </Screen>
    );
  }

  if (workOrderQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (workOrderQuery.isError || !workOrderQuery.data) {
    return (
      <Screen>
        <ErrorState
          message={strings.errors.loadWorkOrder}
          onRetry={() => workOrderQuery.refetch()}
        />
      </Screen>
    );
  }

  const order = workOrderQuery.data;

  if (!canCustomerEditWorkOrder(order)) {
    return (
      <Screen>
        <ErrorState message={strings.errors.workOrderNotEditable} onRetry={() => router.back()} />
      </Screen>
    );
  }

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(
      { id: order.id, input: values },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => {
            router.back();
          }, 700);
        },
      },
    );
  });

  if (saved) {
    return (
      <Screen>
        <Text style={styles.successTitle}>{strings.workOrders.editSaved}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenTopNav onBack={() => router.back()} />

      <Text style={styles.title}>{strings.workOrders.editTitle}</Text>
      <Text style={styles.subtitle}>{strings.workOrders.editSubtitle}</Text>

      <Controller
        control={control}
        name="problemDescription"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.workOrders.fields.issue}
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.problemDescription?.message}
            style={styles.textArea}
          />
        )}
      />
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
            label={strings.workOrders.fields.contactPerson}
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
          <AppInput
            label={strings.workOrders.fields.phone}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.contactPhone?.message}
          />
        )}
      />

      <AppButton
        label={strings.common.save}
        loading={updateMutation.isPending}
        onPress={onSubmit}
        style={styles.submit}
      />
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
    fontSize: typography.size.md,
    lineHeight: 18,
    color: colors.text.muted,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  submit: {
    marginTop: spacing.lg,
  },
  successTitle: {
    marginTop: spacing['3xl'],
    textAlign: 'center',
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
});
