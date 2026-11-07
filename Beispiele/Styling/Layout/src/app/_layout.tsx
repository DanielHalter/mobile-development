import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Layout' }} />
        <Stack.Screen name="breite-hoehe" options={{ title: '5-1 Breite und Höhe' }} />
        <Stack.Screen name="prozent" options={{ title: '5-2 Prozent' }} />
        <Stack.Screen name="flex" options={{ title: '5-3 Flex' }} />
        <Stack.Screen name="quadrate-abstand" options={{ title: '5-4 Abstand' }} />
        <Stack.Screen name="quadrate-ecke" options={{ title: '5-5 Links unten' }} />
      </Stack>
    </>
  );
}
