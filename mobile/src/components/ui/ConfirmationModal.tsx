import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { useStrings } from '@/hooks/use-i18n';
import { colors, radii, typography } from '@/constants/tokens';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const strings = useStrings();
  const resolvedConfirmLabel = confirmLabel ?? strings.common.confirm;
  const resolvedCancelLabel = cancelLabel ?? strings.common.cancel;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <AppButton label={resolvedCancelLabel} variant="secondary" onPress={onCancel} style={styles.action} />
            <AppButton label={resolvedConfirmLabel} onPress={onConfirm} style={styles.action} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.background.overlay,
    padding: 12,
  },
  sheet: {
    borderRadius: radii.card,
    backgroundColor: colors.background.surface,
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.size['3xl'],
    color: colors.text.primary,
  },
  message: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  action: {
    flex: 1,
  },
});
