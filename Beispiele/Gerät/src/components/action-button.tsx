import { Pressable, StyleSheet, Text } from 'react-native';

export function ActionButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
  },
  dimmed: {
    opacity: 0.55,
  },
  label: {
    fontSize: 15,
    color: 'deepskyblue',
  },
});
