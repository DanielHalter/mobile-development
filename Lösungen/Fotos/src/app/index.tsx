import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalItemInput } from '@/components/journal-item-input';
import { JournalItems } from '@/components/journal-items';
import { addJournalEntry, favoriteSections, toggleFavorite, type JournalSection } from '@/utils/journal';

export default function MyJournalScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [grouped, setGrouped] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<JournalSection[]>([]);
  const entries = items.flatMap((section) => section.data);
  const favoriteCount = entries.filter((item) => item.isFavorite).length;
  const visibleItems = favoritesOnly ? favoriteSections(items) : items;
  const emptyText =
    entries.length === 0 ? 'Noch keine Tagebucheinträge' : 'Noch keine Favoriten markiert';

  const bottomInset = Math.max(insets.bottom, process.env.EXPO_OS === 'android' ? 48 : 12);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: bottomInset }]}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}>
      <Pressable style={styles.main} onPress={Keyboard.dismiss}>
      <Text style={styles.heading}>Tagebuch</Text>
      <View style={styles.filters}>
        <Pressable onPress={() => setGrouped((current) => !current)}>
          <Text style={styles.filterAction}>{grouped ? 'Flache Liste' : 'Nach Tag'}</Text>
        </Pressable>
        <Text style={styles.meta}>{favoritesOnly ? 'Nur Favoriten' : 'Alle Einträge'}</Text>
        <Pressable onPress={() => setFavoritesOnly((current) => !current)}>
          <Text style={styles.filterAction}>{favoritesOnly ? 'Alle Einträge' : 'Nur Favoriten'}</Text>
        </Pressable>
        {entries.length > 0 ? (
          <Text style={styles.meta}>
            {favoriteCount} von {entries.length} Einträgen markiert
          </Text>
        ) : null}
      </View>
      <JournalItems
        items={visibleItems}
        grouped={grouped}
        emptyText={emptyText}
        onPressItem={(item) => {
          Keyboard.dismiss();
          setSelected(item.text);
        }}
        onToggleFavorite={(item) => setItems((current) => toggleFavorite(current, item.date))}
      />
      {selected ? <Text style={styles.selected}>Ausgewählt: {selected}</Text> : null}
      </Pressable>
      <JournalItemInput
        onSubmit={(text, photo) => setItems((current) => addJournalEntry(current, text, photo))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1c1e',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterAction: {
    fontSize: 15,
    color: 'deepskyblue',
    paddingVertical: 6,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
  selected: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
