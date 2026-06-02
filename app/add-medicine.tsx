import { useCallback, useState } from 'react';
import { router, Stack, useFocusEffect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { getCurrentFamily, getFamilyMembers } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { FamilyMember } from '@/types';

export default function AddMedicineScreen() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState('');
  const [frequency, setFrequency] = useState('');
  const [foodInstruction, setFoodInstruction] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadMembers() {
        const family = await getCurrentFamily();
        if (!family) {
          router.replace('/create-family');
          return;
        }
        const rows = await getFamilyMembers(family.id);
        setMembers(rows);
        setSelectedMemberId((current) => current || rows[0]?.id || '');
        setLoading(false);
      }

      loadMembers().catch((loadError: Error) => {
        setError(loadError.message);
        setLoading(false);
      });
    }, [])
  );

  async function saveMedicine() {
    setError('');
    setSaving(true);
    const { error: insertError } = await supabase.from('medicines').insert({
      member_id: selectedMemberId,
      name: name.trim(),
      dosage: dosage.trim() || null,
      timing: timing.trim(),
      frequency: frequency.trim() || null,
      food_instruction: foodInstruction.trim() || null
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.replace('/dashboard');
  }

  if (loading) {
    return (
      <Screen footer={false}>
        <LoadingState message="Loading family members..." />
      </Screen>
    );
  }

  return (
    <Screen title="Add Medicine" subtitle="Create a simple schedule item for a family member.">
      <Stack.Screen options={{ title: 'Add Medicine' }} />
      {members.length ? (
        <>
          <Text style={styles.label}>Family member</Text>
          <View style={styles.options}>
            {members.map((member) => (
              <Pressable
                key={member.id}
                onPress={() => setSelectedMemberId(member.id)}
                style={[styles.option, selectedMemberId === member.id && styles.selectedOption]}
              >
                <Text style={[styles.optionText, selectedMemberId === member.id && styles.selectedOptionText]}>
                  {member.name}
                </Text>
              </Pressable>
            ))}
          </View>
          <Input label="Medicine name" value={name} onChangeText={setName} />
          <Input label="Dosage" value={dosage} onChangeText={setDosage} placeholder="1 tablet" />
          <Input label="Timing" value={timing} onChangeText={setTiming} placeholder="Morning after breakfast" />
          <Input label="Frequency" value={frequency} onChangeText={setFrequency} placeholder="Daily" />
          <Input label="Food instruction" value={foodInstruction} onChangeText={setFoodInstruction} placeholder="After food" />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={saving ? 'Saving...' : 'Save Medicine'}
            onPress={saveMedicine}
            disabled={saving || !selectedMemberId || !name.trim() || !timing.trim()}
          />
        </>
      ) : (
        <>
          <EmptyState title="Add a member first" message="Medicines need to be attached to someone in the Family Hub." />
          <Button title="Add Member" onPress={() => router.replace('/add-member')} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  optionText: {
    color: colors.text,
    fontWeight: '700'
  },
  selectedOptionText: {
    color: '#ffffff'
  },
  error: {
    color: colors.danger,
    fontSize: 14
  }
});
