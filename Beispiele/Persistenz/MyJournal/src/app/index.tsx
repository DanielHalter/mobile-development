import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalItemInput } from '@/components/journal-item-input';
import { JournalItems } from '@/components/journal-items';
import { favoriteSections, sectionsFromEntries, toggleFavorite, type JournalEntry } from '@/utils/journal';
import { deleteStoredPhotos, persistPhoto } from '@/utils/photos';
import { Store } from '@/utils/store';
import { getWeather } from '@/utils/weather';

export default function MyJournalScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const itemsRef = useRef<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<JournalEntry[]>([]);
  const sections = sectionsFromEntries(items);
  const favoriteCount = items.filter((item) => item.isFavorite).length;
  const visibleItems = favoritesOnly ? favoriteSections(sections) : sections;
  const emptyText = items.length === 0 ? 'Noch keine Tagebucheinträge' : 'Noch keine Favoriten markiert';

  const bottomInset = Math.max(insets.bottom, process.env.EXPO_OS === 'android' ? 48 : 12);

  useEffect(() => {
    let active = true;

    async function load() {
      const stored = await Store.loadItems();
      if (!active) {
        return;
      }
      itemsRef.current = stored;
      setItems(stored);
      setReady(true);
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  function replaceItems(next: JournalEntry[]) {
    itemsRef.current = next;
    setItems(next);
    return Store.saveItems(next);
  }

  async function addEntry(text: string, photo: string | null) {
    const date = Date.now();
    const storedPhoto = photo ? await persistPhoto(photo, date) : null;
    const entry: JournalEntry = {
      text,
      date,
      isFavorite: false,
      photo: storedPhoto,
      location: null,
      weather: null,
    };
    await replaceItems([entry, ...itemsRef.current]);
    void attachWeather(date);
  }

  async function attachWeather(date: number) {
    const { location, weather } = await getWeather();
    if (!location && !weather) {
      return;
    }
    const current = itemsRef.current;
    if (!current.some((item) => item.date === date)) {
      return;
    }
    await replaceItems(
      current.map((item) => (item.date === date ? { ...item, location, weather } : item)),
    );
  }

  function clearItems() {
    void (async () => {
      await Store.deleteItems();
      deleteStoredPhotos();
      itemsRef.current = [];
      setItems([]);
      setSelected(null);
    })();
  }

  function confirmDelete() {
    const title = 'Einträge löschen';
    const message = 'Sollen wirklich alle Einträge gelöscht werden?';
    if (process.env.EXPO_OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        clearItems();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: 'Nein', style: 'cancel' },
      { text: 'Ja', onPress: clearItems },
    ]);
  }

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
          {items.length > 0 ? (
            <Text style={styles.meta}>
              {favoriteCount} von {items.length} Einträgen markiert
            </Text>
          ) : null}
        </View>
        {ready ? (
          <JournalItems
            items={visibleItems}
            grouped={grouped}
            emptyText={emptyText}
            onPressItem={(item) => {
              Keyboard.dismiss();
              setSelected(item.text);
            }}
            onToggleFavorite={(item) => {
              void replaceItems(toggleFavorite(itemsRef.current, item.date));
            }}
          />
        ) : (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Tagebuch wird geladen…</Text>
          </View>
        )}
        {selected ? <Text style={styles.selected}>Ausgewählt: {selected}</Text> : null}
      </Pressable>
      {ready ? <JournalItemInput onSubmit={addEntry} onDelete={confirmDelete} /> : null}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'darkslategray',
    fontSize: 22,
    fontWeight: '300',
  },
  selected: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
