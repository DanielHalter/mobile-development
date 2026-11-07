import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const examples: { href: Href; title: string }[] = [
  { href: '/breite-hoehe', title: '5-1 Feste Breite und Höhe' },
  { href: '/prozent', title: '5-2 Prozent' },
  { href: '/flex', title: '5-3 Flex 2 : 1 : 3' },
  { href: '/quadrate-abstand', title: '5-4 Abstand und Zentrierung' },
  { href: '/quadrate-ecke', title: '5-5 Links unten' },
];

export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      {examples.map((example) => (
        <Link key={example.href.toString()} href={example.href} asChild>
          <Pressable style={styles.row}>
            <Text style={styles.label}>{example.title}</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 16,
  },
});
