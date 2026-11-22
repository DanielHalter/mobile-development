import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { type JournalEntry } from '@/utils/journal';

type JournalItemRowProps = {
  item: JournalEntry;
  onToggleFavorite: (item: JournalEntry) => void;
  onPress: (item: JournalEntry) => void;
};

export function JournalItemRow({ item, onToggleFavorite, onPress }: JournalItemRowProps) {
  const date = new Date(item.date);
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  const time = `${date.getHours()}:${minutes}`;
  const details = [item.location, item.weather, time].filter(Boolean).join(' ');

  return (
    <View style={styles.row}>
      {item.photo ? <Image style={styles.image} source={{ uri: item.photo }} /> : null}
      <Pressable
        android_ripple={{ color: 'rgba(0, 0, 0, 0.12)' }}
        onPress={() => onPress(item)}
        style={({ pressed }) => [styles.text, pressed && styles.pressed]}>
        <Text style={styles.entryText} numberOfLines={3}>
          {item.text}
        </Text>
        <Text style={styles.time}>{details}</Text>
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
  image: {
    width: 70,
    height: 70,
    marginRight: 8,
    marginTop: 4,
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
  time: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
    alignSelf: 'flex-end',
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
