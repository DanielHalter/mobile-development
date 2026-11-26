import { FlatList, Keyboard, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

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
      <Pressable style={styles.noItems} onPress={Keyboard.dismiss}>
        <Text style={styles.infoText}>{emptyText}</Text>
      </Pressable>
    );
  }

  if (!grouped) {
    return (
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        data={items.flatMap((section) => section.data)}
        keyExtractor={(item) => String(item.date)}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        ListFooterComponent={<Pressable style={styles.listFooter} onPress={Keyboard.dismiss} />}
        renderItem={renderItem}
      />
    );
  }

  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onScrollBeginDrag={Keyboard.dismiss}
      sections={items}
      keyExtractor={(item) => String(item.date)}
      renderSectionHeader={({ section }) => <Text style={styles.listHeader}>{section.title}</Text>}
      ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      ListFooterComponent={<Pressable style={styles.listFooter} onPress={Keyboard.dismiss} />}
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
    marginTop: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  listFooter: {
    flexGrow: 1,
  },
  listHeader: {
    color: '#1c1c1e',
    backgroundColor: 'lightcyan',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 8,
  },
  listSeparator: {
    height: 16,
  },
});
