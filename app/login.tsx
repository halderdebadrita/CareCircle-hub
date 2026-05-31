import { useState } from 'react';
import { Link, router, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { getCurrentFamily } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const family = await getCurrentFamily();
    setLoading(false);
    router.replace(family ? '/dashboard' : '/create-family');
  }

  return (
    <Screen title="Welcome Back" subtitle="Log in to continue caring for your family circle.">
      <Stack.Screen options={{ title: 'Login' }} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" textContentType="emailAddress" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry textContentType="password" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading || !email || !password} />
      <Text style={styles.linkText}>
        New to CareCircle Hub? <Link href="/signup" style={styles.link}>Create an account</Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14
  },
  linkText: {
    color: colors.muted,
    fontSize: 15,
    marginTop: spacing.sm,
    textAlign: 'center'
  },
  link: {
    color: colors.primary,
    fontWeight: '800'
  }
});
