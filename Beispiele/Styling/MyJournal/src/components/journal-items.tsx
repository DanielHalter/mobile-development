import { FlatList, SectionList, StyleSheet, Text, View } from 'react-native';

import { JournalItemRow } from '@/components/journal-item-row';
import { type JournalEntry, type JournalSection } from '@/utils/journal';

type JournalItemsProps = {
  items: JournalSection[];
  grouped: boolean;
  emptyText: string;
  onPressItem: (item: JournalEntry) => void;
  onToggleFavorite: (item: JournalEntry) => void;
};

export function JournalItems({
  items,
  grouped,
  emptyText,
  onPressItem,
  onToggleFavorite,
}: JournalItemsProps) {
  function renderItem({ item }: { item: JournalEntry }) {
    return (
      <JournalItemRow item={item} onPress={onPressItem} onToggleFavorite={onToggleFavorite} />
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.noItems}>
        <Text style={styles.infoText}>{emptyText}</Text>
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
});
