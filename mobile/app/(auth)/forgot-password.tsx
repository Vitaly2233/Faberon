import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useStrings } from '@/hooks/use-i18n';
import { colors, spacing, typography } from '@/constants/tokens';

export default function ForgotPasswordScreen() {
  const strings = useStrings();
  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>{strings.auth.forgotPasswordTitle}</Text>
      <Text style={styles.description}>{strings.auth.forgotPasswordDescription}</Text>
      <AppButton label={strings.common.back} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.lg,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});
