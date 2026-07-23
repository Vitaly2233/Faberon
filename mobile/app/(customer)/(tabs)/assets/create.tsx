import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { useStrings } from '@/hooks/use-i18n';
import { routes } from '@/constants/routes';
import { spacing, typography, colors } from '@/constants/tokens';
import { useCreateAssetMutation } from '@/hooks/use-app-queries';
import { createAssetSchema, type CreateAssetFormValues } from '@/schemas/asset.schema';

export default function CreateAssetScreen() {
  const strings = useStrings();
  const createMutation = useCreateAssetMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      assetType: 'printer',
      manufacturer: '',
      model: '',
      serialNumber: '',
      description: '',
      ownershipType: 'CUSTOMER_OWNED',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const asset = await createMutation.mutateAsync(values);
    router.replace(routes.customer.assetDetail(asset.id));
  });

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTopNav onBack={() => router.back()} />
      <Text style={styles.title}>{strings.assets.addPrinter}</Text>

      <Controller
        control={control}
        name="assetType"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.assets.fields.type}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.assetType?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="manufacturer"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.assets.fields.manufacturer}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.manufacturer?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="model"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.assets.fields.model}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.model?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="serialNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.assets.fields.serialNumber}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.assets.fields.description}
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.textArea}
          />
        )}
      />

      <AppButton label={strings.common.save} loading={createMutation.isPending} onPress={onSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
});
