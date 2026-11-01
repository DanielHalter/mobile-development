import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, useState, type ComponentRef } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalItems } from '@/components/journal-items';
import { addJournalEntry, type JournalSection } from '@/utils/journal';

export default function MyJournalScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [draft, setDraft] = useState('');
  const [grouped, setGrouped] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<JournalSection[]>([]);

  function addItem(text: string) {
    const entry = text.trim();
    if (!entry) {
      return;
    }
    setItems((current) => addJournalEntry(current, entry));
    setDraft('');
    inputRef.current?.clear();
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
      <JournalItems
        items={items}
        grouped={grouped}
        onPressItem={(item) => setSelected(item.text)}
      />
      {selected ? <Text style={styles.selected}>Ausgewählt: {selected}</Text> : null}
      <View style={[styles.composer, { marginBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Tagebucheintrag erstellen"
          returnKeyType="done"
          onChangeText={setDraft}
          onSubmitEditing={(event) => addItem(event.nativeEvent.text)}
        />
        <Button title="Hinzufügen" onPress={() => addItem(draft)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  composer: {
    margin: 12,
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
  },
  selected: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
});
