import { FlatList, Pressable, SectionList, StyleSheet, Text } from 'react-native';

import { type JournalEntry, type JournalSection } from '@/utils/journal';

type JournalItemsProps = {
  items: JournalSection[];
  grouped: boolean;
  onPressItem: (item: JournalEntry) => void;
};

export function JournalItems({ items, grouped, onPressItem }: JournalItemsProps) {
  function renderItem({ item }: { item: JournalEntry }) {
    return (
      <Pressable
        android_ripple={{ color: 'rgba(0, 0, 0, 0.12)' }}
        onPress={() => onPressItem(item)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Text>{item.text}</Text>
      </Pressable>
    );
  }

  if (!grouped) {
    return (
      <FlatList
        style={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        data={items.flatMap((section) => section.data)}
        keyExtractor={(item) => String(item.date)}
        ListEmptyComponent={<Text style={styles.empty}>Keine Einträge im Tagebuch</Text>}
        renderItem={renderItem}
      />
    );
  }

  return (
    <SectionList
      style={styles.list}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      sections={items}
      keyExtractor={(item) => String(item.date)}
      ListEmptyComponent={<Text style={styles.empty}>Keine Einträge im Tagebuch</Text>}
      renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  empty: {
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: 'darkgray',
    padding: 8,
  },
  row: {
    padding: 12,
  },
  pressed: {
    opacity: 0.6,
  },
});
