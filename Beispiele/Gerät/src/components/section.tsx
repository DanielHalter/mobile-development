import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Section({
  title,
  purpose,
  children,
}: {
  title: string;
  purpose: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.purpose}>{purpose}</Text>
      {children}
    </View>
  );
}

export function Hint({ children }: { children: string }) {
  return <Text style={styles.hint}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#f2f2f7',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  purpose: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
});
