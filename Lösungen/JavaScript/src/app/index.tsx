import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing, useTheme } from '@/constants/theme';

const solutions: { href: Href; title: string; folder: string }[] = [
  { href: '/kontrollstrukturen-if', title: 'if / Formular', folder: 'Kontrollstrukturen-IF' },
  { href: '/formular-validierung', title: 'Formular-Validierung', folder: 'FormularValidierung' },
  { href: '/pacman', title: 'Pacman', folder: 'Pacman' },
];

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.systemBackground }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Text style={{ color: theme.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
        React-Native-Lösungen zu Javascript/Lösungen. Dieselben drei Aufgaben, hier zum
        Starten in Expo Go.
      </Text>
      {solutions.map((solution) => (
        <Link key={solution.href.toString()} href={solution.href} asChild>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <View style={[styles.card, { backgroundColor: theme.secondarySystemBackground }]}>
              <Text style={{ color: theme.label, fontSize: 16, fontWeight: '600' }}>{solution.title}</Text>
              <Text style={{ color: theme.secondaryLabel, fontSize: 14 }}>{solution.folder}</Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
