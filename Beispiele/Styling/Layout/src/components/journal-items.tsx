import { FlatList, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

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
        style={({ pressed }) => pressed && styles.pressed}>
        <View>
          <Text>{item.text}</Text>
        </View>
      </Pressable>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.noItems}>
        <Text style={styles.infoText}>Keine Einträge im Tagebuch</Text>
      </View>
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
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
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
      renderSectionHeader={({ section }) => <Text style={styles.listHeader}>{section.title}</Text>}
      ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  infoText: {
    color: 'darkslategray',
    fontSize: 22,
    fontWeight: '300',
  },
  noItems: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    marginTop: 24,
  },
  listHeader: {
    color: 'gray',
    backgroundColor: 'lightcyan',
    textAlign: 'center',
  },
  listSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightblue',
  },
  pressed: {
    opacity: 0.6,
  },
});
