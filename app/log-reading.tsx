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
import type { FamilyMember, Vital } from '@/types';

type ReadingType = Extract<Vital['type'], 'bp' | 'sugar'>;

export default function LogReadingScreen() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [type, setType] = useState<ReadingType>('bp');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [context, setContext] = useState('');
  const [notes, setNotes] = useState('');
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

  async function saveReading() {
    setError('');
    setSaving(true);
    const { error: insertError } = await supabase.from('vitals').insert({
      member_id: selectedMemberId,
      type,
      value_1: value1.trim(),
      value_2: value2.trim() || null,
      context: context.trim() || null,
      notes: notes.trim() || null
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
    <Screen title="Log Reading" subtitle="Capture BP or sugar readings for the family timeline.">
      <Stack.Screen options={{ title: 'Log Reading' }} />
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

          <Text style={styles.label}>Type</Text>
          <View style={styles.options}>
            {(['bp', 'sugar'] as ReadingType[]).map((readingType) => (
              <Pressable
                key={readingType}
                onPress={() => setType(readingType)}
                style={[styles.option, type === readingType && styles.selectedOption]}
              >
                <Text style={[styles.optionText, type === readingType && styles.selectedOptionText]}>
                  {readingType === 'bp' ? 'BP' : 'Sugar'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input label={type === 'bp' ? 'Value 1 (systolic)' : 'Value 1'} value={value1} onChangeText={setValue1} />
          <Input label={type === 'bp' ? 'Value 2 (diastolic)' : 'Value 2 optional'} value={value2} onChangeText={setValue2} />
          <Input label="Context" value={context} onChangeText={setContext} placeholder="fasting, post-meal, random" />
          <Input label="Notes" value={notes} onChangeText={setNotes} multiline />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={saving ? 'Saving...' : 'Save Reading'}
            onPress={saveReading}
            disabled={saving || !selectedMemberId || !value1.trim()}
          />
        </>
      ) : (
        <>
          <EmptyState title="Add a member first" message="Readings need to be attached to someone in the Family Hub." />
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
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  selectedOptionText: {
    color: '#ffffff'
  },
  error: {
    color: colors.danger,
    fontSize: 14
  }
});
