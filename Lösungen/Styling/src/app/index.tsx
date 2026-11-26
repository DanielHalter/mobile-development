import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalItems } from '@/components/journal-items';
import { addJournalEntry, favoriteSections, toggleFavorite, type JournalSection } from '@/utils/journal';

export default function MyJournalScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [entry, setEntry] = useState('');
  const [grouped, setGrouped] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<JournalSection[]>([]);
  const entries = items.flatMap((section) => section.data);
  const favoriteCount = entries.filter((item) => item.isFavorite).length;
  const visibleItems = favoritesOnly ? favoriteSections(items) : items;
  const emptyText =
    entries.length === 0 ? 'Noch keine Tagebucheinträge' : 'Noch keine Favoriten markiert';

  function submit() {
    const text = entry.trim();
    if (!text) {
      return;
    }
    setItems((current) => addJournalEntry(current, text));
    setEntry('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}>
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
        onPressItem={(item) => setSelected(item.text)}
        onToggleFavorite={(item) => setItems((current) => toggleFavorite(current, item.date))}
      />
      {selected ? <Text style={styles.selected}>Ausgewählt: {selected}</Text> : null}
      <View style={[styles.composer, { marginBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.meta}>{entry || 'Noch kein Text'}</Text>
        <TextInput
          value={entry}
          onChangeText={setEntry}
          onSubmitEditing={submit}
          placeholder="Tagebucheintrag erstellen"
          returnKeyType="done"
          blurOnSubmit
          multiline
          underlineColorAndroid="transparent"
          style={styles.input}
        />
        <Pressable accessibilityRole="button" onPress={submit} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>Eintrag hinzufügen</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  composer: {
    borderColor: 'deepskyblue',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    marginTop: 8,
    padding: 8,
    gap: 8,
  },
  input: {
    minHeight: 40,
    maxHeight: 120,
    fontSize: 17,
    lineHeight: 24,
    color: '#1c1c1e',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
