import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { ScreenTopNav } from '@/components/navigation/ScreenTopNav';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { useCustomerProfileQuery, useUpdateCustomerProfileMutation } from '@/hooks/use-app-queries';
import {
  updateCustomerProfileSchema,
  type UpdateCustomerProfileFormValues,
} from '@/schemas/profile.schema';

export default function CustomerProfileSettingsScreen() {
  const strings = useStrings();
  const profileQuery = useCustomerProfileQuery();
  const updateMutation = useUpdateCustomerProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerProfileFormValues>({
    resolver: zodResolver(updateCustomerProfileSchema),
    defaultValues: {
      contactPersonName: '',
      companyName: '',
      email: '',
      phone: '',
      defaultAddress: '',
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    const defaultContact =
      profileQuery.data.company.contacts.find((contact) => contact.isDefault) ??
      profileQuery.data.company.contacts[0];

    reset({
      contactPersonName: defaultContact?.name ?? profileQuery.data.displayName,
      companyName: profileQuery.data.company.companyName,
      email: profileQuery.data.email,
      phone: defaultContact?.phone ?? '',
      defaultAddress: profileQuery.data.company.defaultAddress,
    });
  }, [profileQuery.data, reset]);

  if (profileQuery.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (profileQuery.isError) {
    return (
      <Screen>
        <ScreenTopNav onBack={() => router.back()} />
        <ErrorState message={strings.errors.loadProfile} onRetry={() => profileQuery.refetch()} />
      </Screen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    await updateMutation.mutateAsync(values);
    router.back();
  });

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTopNav onBack={() => router.back()} />
      <Text style={styles.title}>{strings.profile.settingsTitle}</Text>
      <Text style={styles.subtitle}>{strings.profile.settingsSubtitle}</Text>

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
            autoCapitalize="words"
          />
        )}
      />
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.profile.company}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.companyName?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.auth.email}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.profile.phone}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.phone?.message}
            keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="defaultAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.profile.defaultAddress}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.defaultAddress?.message}
            multiline
          />
        )}
      />

      <LanguagePicker />

      <AppButton
        label={strings.profile.saveChanges}
        loading={updateMutation.isPending}
        onPress={onSubmit}
        style={styles.saveButton}
      />
      <AppButton label={strings.common.cancel} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  title: {
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  subtitle: {
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 18,
    color: colors.text.muted,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
