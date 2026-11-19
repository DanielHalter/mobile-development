import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, useState, type ComponentRef } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalItems } from '@/components/journal-items';
import {
  addJournalEntry,
  countEntries,
  countFavorites,
  favoriteSections,
  toggleFavorite,
  type JournalEntry,
  type JournalSection,
} from '@/utils/journal';

type Filter = 'all' | 'favorites';

export default function MyJournalScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [draft, setDraft] = useState('');
  const [grouped, setGrouped] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  // Enthält immer ALLE Einträge – gefiltert wird nur für die Anzeige
  const [items, setItems] = useState<JournalSection[]>([]);

  const total = countEntries(items);
  const favorites = countFavorites(items);
  const visibleItems = filter === 'favorites' ? favoriteSections(items) : items;
  const emptyText =
    total === 0 ? 'Noch keine Tagebucheinträge' : 'Noch keine Favoriten markiert';

  function addItem(text: string) {
    const entry = text.trim();
    if (!entry) {
      return;
    }
    setItems((current) => addJournalEntry(current, entry));
    setDraft('');
    inputRef.current?.clear();
  }

  // Callback aus JournalItemRow – die Liste wird hier in der übergeordneten Komponente geändert
  function handleToggleFavorite(item: JournalEntry) {
    setItems((current) => toggleFavorite(current, item.date));
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}>
      <View>
        <Button
          title={grouped ? 'Flache Liste' : 'Nach Tag'}
          onPress={() => setGrouped((current) => !current)}
        />
      </View>

      <View style={styles.filterBar}>
        <FilterButton
          label="Alle Einträge"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          label="Nur Favoriten"
          active={filter === 'favorites'}
          onPress={() => setFilter('favorites')}
        />
      </View>

      {total > 0 ? (
        <Text style={styles.counter}>
          {favorites} von {total} Einträgen markiert
        </Text>
      ) : null}

      <JournalItems
        items={visibleItems}
        grouped={grouped}
        emptyText={emptyText}
        onPressItem={(item) => setSelected(item.text)}
        onToggleFavorite={handleToggleFavorite}
      />
      {selected ? <Text style={styles.selected}>Ausgewählt: {selected}</Text> : null}
      {/* Nähe: Vorschau, Eingabe und Button in EINEM Rahmen (Card) */}
      <View style={[styles.composer, { marginBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.preview} numberOfLines={1}>
          {draft || 'Noch kein Text'}
        </Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Tagebucheintrag erstellen"
          placeholderTextColor="#666"
          returnKeyType="done"
          underlineColorAndroid="transparent"
          onChangeText={setDraft}
          onSubmitEditing={(event) => addItem(event.nativeEvent.text)}
        />
        {/* RN-<Button> ist nicht stylebar → Pressable für volle Breite + Radius */}
        <Pressable
          accessibilityRole="button"
          onPress={() => addItem(draft)}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <Text style={styles.addButtonLabel}>Eintrag hinzufügen</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.filterButton, active && styles.filterButtonActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'steelblue',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'steelblue',
  },
  filterText: {
    color: 'steelblue',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  counter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: 'gray',
  },
  composer: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'deepskyblue',
    borderRadius: 8,
  },
  preview: {
    fontSize: 12,
    color: 'gray',
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selected: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
});