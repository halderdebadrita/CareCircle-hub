import { useState } from 'react';
import { router, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { getCurrentFamily } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function AddMemberScreen() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function saveMember() {
    setError('');
    setLoading(true);
    const family = await getCurrentFamily();
    if (!family) {
      router.replace('/create-family');
      return;
    }

    const { error: insertError } = await supabase.from('family_members').insert({
      family_id: family.id,
      name: name.trim(),
      relation: relation.trim() || null,
      age: age.trim() ? Number(age) : null,
      blood_group: bloodGroup.trim() || null,
      notes: notes.trim() || null
    });
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.replace('/dashboard');
  }

  return (
    <Screen title="Add Family Member" subtitle="Add the people cared for in this hub.">
      <Stack.Screen options={{ title: 'Add Member' }} />
      <Input label="Name" value={name} onChangeText={setName} />
      <Input label="Relation" value={relation} onChangeText={setRelation} placeholder="Mother, Father, Child" />
      <Input label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
      <Input label="Blood group" value={bloodGroup} onChangeText={setBloodGroup} autoCapitalize="characters" />
      <Input label="Notes" value={notes} onChangeText={setNotes} multiline />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Saving...' : 'Save Member'} onPress={saveMember} disabled={loading || !name.trim()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14
  }
});
