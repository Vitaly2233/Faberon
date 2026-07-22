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
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { useStrings } from '@/hooks/use-i18n';
import { spacing, typography, colors } from '@/constants/tokens';
import { useTechnicianProfileQuery, useUpdateTechnicianProfileMutation } from '@/hooks/use-app-queries';
import {
  updateTechnicianProfileSchema,
  type UpdateTechnicianProfileFormValues,
} from '@/schemas/technician-profile.schema';

export default function OwnerProfileSettingsScreen() {
  const strings = useStrings();
  const profileQuery = useTechnicianProfileQuery();
  const updateMutation = useUpdateTechnicianProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTechnicianProfileFormValues>({
    resolver: zodResolver(updateTechnicianProfileSchema),
    defaultValues: {
      displayName: '',
      email: '',
      phone: '',
      serviceBaseAddress: '',
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    reset({
      displayName: profileQuery.data.displayName,
      email: profileQuery.data.email,
      phone: profileQuery.data.phone ?? '',
      serviceBaseAddress: profileQuery.data.serviceBaseAddress ?? '',
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
        <ScreenBackButton onPress={() => router.back()} />
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
      <ScreenBackButton onPress={() => router.back()} />
      <Text style={styles.title}>{strings.profile.settingsTitle}</Text>
      <Text style={styles.subtitle}>{strings.technician.settingsSubtitle}</Text>

      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.technician.fullName}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.displayName?.message}
            autoCapitalize="words"
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
        name="serviceBaseAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label={strings.technician.serviceBase}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.serviceBaseAddress?.message}
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
