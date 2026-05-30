import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  }
});
