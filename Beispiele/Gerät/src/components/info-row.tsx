import { StyleSheet, Text, View } from 'react-native';

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#3c3c43',
  },
  value: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'right',
    color: '#1c1c1e',
    fontVariant: ['tabular-nums'],
  },
});
