import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fffaf4' },
          headerTintColor: '#24342f',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#fffaf4' }
        }}
      />
    </>
  );
}
