import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from '@/constants/theme';
import type { MedicineWithMember } from '@/types';

type MedicineCardProps = {
  medicine: MedicineWithMember;
  onTaken: () => void;
  onSkipped: () => void;
  busy?: boolean;
};

export function MedicineCard({ medicine, onTaken, onSkipped, busy = false }: MedicineCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.member}>{medicine.family_members?.name ?? 'Family member'}</Text>
      <Text style={styles.name}>{medicine.name}</Text>
      <Text style={styles.detail}>{[medicine.dosage, medicine.timing].filter(Boolean).join(' - ')}</Text>
      {medicine.food_instruction ? <Text style={styles.note}>{medicine.food_instruction}</Text> : null}
      <View style={styles.actions}>
        <Button title="Mark Taken" onPress={onTaken} disabled={busy} style={styles.action} />
        <Button title="Mark Skipped" onPress={onSkipped} disabled={busy} variant="secondary" style={styles.action} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  member: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  detail: {
    color: colors.text,
    fontSize: 15
  },
  note: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  action: {
    flex: 1
  }
});
