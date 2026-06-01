import { useState } from 'react';
import { router, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/theme';
import { getCurrentUserId } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function CreateFamilyScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError('');
    setLoading(true);
    const userId = await getCurrentUserId();
    if (!userId) {
      router.replace('/login');
      return;
    }

    const { error: insertError } = await supabase.from('families').insert({ name: name.trim(), created_by: userId });
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.replace('/dashboard');
  }

  return (
    <Screen title="Create your Family Hub" subtitle="Give your shared care space a simple name.">
      <Stack.Screen options={{ title: 'Family Hub' }} />
      <Input label="Family name" value={name} onChangeText={setName} placeholder="The Sharma Family" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Creating...' : 'Create Family Hub'} onPress={handleCreate} disabled={loading || !name.trim()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14
  }
});
