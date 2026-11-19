import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type JournalEntry } from '@/utils/journal';

type JournalItemRowProps = {
  item: JournalEntry;
  onPress: (item: JournalEntry) => void;
  onToggleFavorite: (item: JournalEntry) => void;
};

export function JournalItemRow({ item, onPress, onToggleFavorite }: JournalItemRowProps) {
  return (
    <View style={styles.row}>
      <Pressable
        android_ripple={{ color: 'rgba(0, 0, 0, 0.12)' }}
        onPress={() => onPress(item)}
        style={({ pressed }) => [styles.textArea, pressed && styles.pressed]}>
        <Text>{item.text}</Text>
      </Pressable>
      <Pressable
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={item.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}
        onPress={() => onToggleFavorite(item)}
        style={({ pressed }) => [styles.starButton, pressed && styles.pressed]}>
        <Text style={[styles.star, item.isFavorite && styles.starActive]}>
          {item.isFavorite ? '★' : '☆'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    padding: 12,
  },
  starButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  star: {
    fontSize: 22,
    color: 'gray',
  },
  starActive: {
    color: 'goldenrod',
  },
  pressed: {
    opacity: 0.6,
  },
});