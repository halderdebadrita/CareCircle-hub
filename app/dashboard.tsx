import { useCallback, useState } from 'react';
import { router, Stack, useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { MedicineCard } from '@/components/MedicineCard';
import { MemberCard } from '@/components/MemberCard';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { getActiveMedicines, getCurrentFamily, getFamilyMembers } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { Family, FamilyMember, MedicineWithMember } from '@/types';

export default function DashboardScreen() {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [medicines, setMedicines] = useState<MedicineWithMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [busyMedicineId, setBusyMedicineId] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const currentFamily = await getCurrentFamily();
    if (!currentFamily) {
      router.replace('/create-family');
      return;
    }

    const [memberRows, medicineRows] = await Promise.all([
      getFamilyMembers(currentFamily.id),
      getActiveMedicines(currentFamily.id)
    ]);
    setFamily(currentFamily);
    setMembers(memberRows);
    setMedicines(medicineRows);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard().catch((loadError: Error) => {
        setMessage(loadError.message);
        setLoading(false);
      });
    }, [loadDashboard])
  );

  async function logMedicine(medicine: MedicineWithMember, status: 'taken' | 'skipped') {
    setBusyMedicineId(medicine.id);
    setMessage('');
    const { error } = await supabase.from('medicine_logs').insert({
      medicine_id: medicine.id,
      member_id: medicine.member_id,
      status
    });
    setBusyMedicineId('');

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(status === 'taken' ? 'Marked as taken.' : 'Marked as skipped.');
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (loading) {
    return (
      <Screen footer={false}>
        <LoadingState message="Loading Today's Care Board..." />
      </Screen>
    );
  }

  return (
    <Screen title="Today's Care Board" subtitle={family?.name ?? 'Family Hub'}>
      <Stack.Screen options={{ title: 'Care Board' }} />
      <View style={styles.actions}>
        <Button title="Add Member" onPress={() => router.push('/add-member')} style={styles.actionButton} />
        <Button title="Add Medicine" onPress={() => router.push('/add-medicine')} variant="secondary" style={styles.actionButton} />
        <Button title="Log Reading" onPress={() => router.push('/log-reading')} variant="secondary" style={styles.actionButton} />
      </View>

      {message ? <Text style={message.includes('Marked') ? styles.success : styles.error}>{message}</Text> : null}

      <Text style={styles.sectionTitle}>Family Hub</Text>
      {members.length ? (
        members.map((member) => (
          <MemberCard key={member.id} member={member} onPress={() => router.push(`/member/${member.id}`)} />
        ))
      ) : (
        <EmptyState title="No family members yet" message="Add your first member to start medicines and readings." />
      )}

      <Text style={styles.sectionTitle}>Today's active medicines</Text>
      {medicines.length ? (
        medicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            busy={busyMedicineId === medicine.id}
            onTaken={() => logMedicine(medicine, 'taken')}
            onSkipped={() => logMedicine(medicine, 'skipped')}
          />
        ))
      ) : (
        <EmptyState title="No medicines scheduled" message="Add medicines for a family member to see them here." />
      )}

      <Button title="Logout" onPress={logout} variant="danger" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  actionButton: {
    flexGrow: 1
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.sm
  },
  success: {
    color: colors.success,
    fontSize: 14
  },
  error: {
    color: colors.danger,
    fontSize: 14
  }
});
