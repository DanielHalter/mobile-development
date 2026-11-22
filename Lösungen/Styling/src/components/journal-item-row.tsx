import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type JournalEntry } from '@/utils/journal';

type JournalItemRowProps = {
  item: JournalEntry;
  onToggleFavorite: (item: JournalEntry) => void;
  onPress: (item: JournalEntry) => void;
};

export function JournalItemRow({ item, onToggleFavorite, onPress }: JournalItemRowProps) {
  return (
    <View style={styles.row}>
      <Pressable
        android_ripple={{ color: 'rgba(0, 0, 0, 0.12)' }}
        onPress={() => onPress(item)}
        style={({ pressed }) => [styles.text, pressed && styles.pressed]}>
        <Text style={styles.entryText}>{item.text}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={item.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}
        onPress={() => onToggleFavorite(item)}
        style={styles.star}>
        <Text style={[styles.starLabel, item.isFavorite && styles.starActive]}>
          {item.isFavorite ? '★' : '☆'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
  },
  text: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 4,
  },
  entryText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#1c1c1e',
  },
  pressed: {
    opacity: 0.6,
  },
  star: {
    padding: 4,
  },
  starLabel: {
    fontSize: 18,
    color: '#666666',
  },
  starActive: {
    color: '#1c1c1e',
  },
});
