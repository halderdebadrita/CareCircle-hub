import { useState } from 'react';
import { Link, router, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError('');
    setMessage('');
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace('/create-family');
      return;
    }

    setMessage('Account created. Please check your email if confirmation is enabled, then log in.');
  }

  return (
    <Screen title="Create Account" subtitle="Start a private hub for your household's everyday care.">
      <Stack.Screen options={{ title: 'Signup' }} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" textContentType="emailAddress" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry textContentType="newPassword" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button title={loading ? 'Creating...' : 'Signup'} onPress={handleSignup} disabled={loading || !email || !password} />
      <Text style={styles.linkText}>
        Already have an account? <Link href="/login" style={styles.link}>Log in</Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14
  },
  message: {
    color: colors.success,
    fontSize: 14,
    lineHeight: 20
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
