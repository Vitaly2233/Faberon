import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { env } from '@/constants/env';
import { useStrings } from '@/hooks/use-i18n';
import { colors, iconSizes, radii, shadows, spacing, typography } from '@/constants/tokens';
import { DevRoleSwitcher } from '@/features/auth/DevRoleSwitcher';
import { getRoleHomePath } from '@/features/auth/auth-redirect';
import { useDevAuthStore } from '@/features/auth/dev-auth.store';
import { useLoginMutation } from '@/hooks/use-app-queries';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';

export default function LoginScreen() {
  const strings = useStrings();
  const loginMutation = useLoginMutation();
  const devRole = useDevAuthStore((state) => state.devRole);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: env.useMocks ? 'j.doe@grandhotel.com' : '',
      password: env.useMocks ? 'password' : '',
      rememberMe: true,
      companyId: env.companyId || undefined,
      role: devRole,
    },
  });

  useEffect(() => {
    setValue('role', devRole);
  }, [devRole, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    const session = await loginMutation.mutateAsync({
      ...values,
      role: values.role ?? devRole,
      companyId: values.companyId?.trim() || env.companyId || undefined,
    });
    router.replace(getRoleHomePath(session.user.role));
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.brand}>{strings.appName}</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.iconBadge}>
          <Feather name="key" size={iconSizes['3xl']} color={colors.text.inverse} />
        </View>
        <Text style={styles.kicker}>{strings.auth.clientPortal}</Text>
        <Text style={styles.headline}>{strings.auth.clientHeadline}</Text>
        <Text style={styles.subtitle}>{strings.auth.clientSubtitle}</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.auth.email}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={strings.auth.password}
                secureTextEntry
                autoComplete="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          {!env.useMocks ? (
            <Controller
              control={control}
              name="companyId"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Company ID"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                  error={errors.companyId?.message}
                  placeholder={env.companyId || '019535d9-3df6-71ec-8f08-fa907fa17f9d'}
                />
              )}
            />
          ) : null}

          <View style={styles.formRow}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { onChange, value } }) => (
                <View style={styles.rememberRow}>
                  <Switch
                    value={Boolean(value)}
                    onValueChange={onChange}
                    trackColor={{ false: colors.border.input, true: colors.brand.primary }}
                    thumbColor={colors.background.surface}
                  />
                  <Text style={styles.rememberLabel}>{strings.auth.rememberMe}</Text>
                </View>
              )}
            />
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable accessibilityRole="link">
                <Text style={styles.forgotLink}>{strings.auth.forgotPassword}</Text>
              </Pressable>
            </Link>
          </View>

          <AppButton
            label={strings.auth.signIn}
            loading={loginMutation.isPending}
            onPress={onSubmit}
          />

          {env.devRoleSwitcher || !env.useMocks ? <DevRoleSwitcher /> : null}
        </View>
      </View>

      <Text style={styles.footer}>
        By continuing, you agree to the privacy policy and terms of service.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.login,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    paddingTop: spacing.sm,
  },
  brand: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.snug * typography.size['2xl'],
  },
  hero: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing['3xl'],
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.primary,
    marginBottom: spacing['2xl'],
    ...shadows.lg,
  },
  kicker: {
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size.md,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest * typography.size.md,
  },
  headline: {
    maxWidth: 300,
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['6xl'],
    lineHeight: typography.size['6xl'] * typography.lineHeight.tight,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight * typography.size['6xl'],
  },
  subtitle: {
    marginTop: spacing.lg,
    maxWidth: 320,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  form: {
    marginTop: spacing['3xl'],
    gap: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rememberLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    color: colors.text.label,
  },
  forgotLink: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  footer: {
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: 16,
    color: colors.text.tertiary,
  },
});
