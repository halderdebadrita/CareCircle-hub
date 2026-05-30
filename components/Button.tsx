import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export function Button({ title, onPress, disabled = false, variant = 'primary', style }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderWidth: 1
  },
  danger: {
    backgroundColor: colors.danger
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    opacity: 0.82
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  secondaryText: {
    color: colors.text
  }
});
