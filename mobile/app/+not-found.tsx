import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/constants/tokens';
import { useStrings } from '@/hooks/use-i18n';

export default function NotFoundScreen() {
  const strings = useStrings();

  return (
    <>
      <Stack.Screen options={{ title: strings.notFound.title }} />
      <View style={styles.container}>
        <Text style={styles.title}>{strings.notFound.title}</Text>
        <Link href="/" style={styles.link}>
          {strings.notFound.goHome}
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background.canvas,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
  },
  link: {
    marginTop: 16,
    fontFamily: typography.fontFamily.semibold,
    color: colors.brand.primary,
  },
});
