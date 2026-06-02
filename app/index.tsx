import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { getCurrentFamily } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function IndexScreen() {
  const [message, setMessage] = useState('Checking your session...');

  useEffect(() => {
    async function routeUser() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
        return;
      }

      setMessage('Finding your Family Hub...');
      const family = await getCurrentFamily();
      router.replace(family ? '/dashboard' : '/create-family');
    }

    routeUser().catch(() => router.replace('/login'));
  }, []);

  return (
    <Screen footer={false}>
      <LoadingState message={message} />
    </Screen>
  );
}
