import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState, type ComponentRef } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { persistPhoto } from '@/utils/photos';

type JournalItemInputProps = {
  onSubmit: (text: string, photo: string | null) => Promise<void> | void;
  onDelete: () => void;
};

export function JournalItemInput({ onSubmit, onDelete }: JournalItemInputProps) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const keepUntil = useRef(0);
  const entryRef = useRef('');
  const photoRef = useRef<string | null>(null);
  const savingRef = useRef(false);
  const pickingRef = useRef(false);
  const [entry, setEntry] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateEntry(value: string) {
    entryRef.current = value;
    setEntry(value);
  }

  function updatePhoto(value: string | null) {
    photoRef.current = value;
    setPhoto(value);
  }

  function clearDraft() {
    updateEntry('');
    updatePhoto(null);
  }

  async function launchCamera() {
    pickingRef.current = true;
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (result.canceled || !result.assets[0]) {
        return;
      }
      const uri = result.assets[0].uri;
      const durable = process.env.EXPO_OS === 'web' ? await persistPhoto(uri, Date.now()) : uri;
      updatePhoto(durable);
      inputRef.current?.focus();
    } finally {
      holdDraft();
      pickingRef.current = false;
    }
  }

  function holdDraft() {
    keepUntil.current = Date.now() + 300;
  }

  async function submit() {
    holdDraft();
    const text = entryRef.current.trim();
    const currentPhoto = photoRef.current;
    if (!text || savingRef.current) {
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      await onSubmit(text, currentPhoto);
      clearDraft();
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function cancelDraft() {
    setTimeout(() => {
      if (pickingRef.current || savingRef.current || Date.now() < keepUntil.current) {
        return;
      }
      clearDraft();
    }, 100);
  }

  return (
    <View style={styles.composer}>
      <Text style={styles.meta}>{entry || 'Noch kein Text'}</Text>
      <View style={styles.fieldRow}>
        <Pressable
          accessibilityLabel="Foto aufnehmen"
          onPressIn={holdDraft}
          onPress={() => void launchCamera()}
          style={styles.photoIcon}>
          {photo ? (
            <Image style={styles.imagePreview} source={{ uri: photo }} />
          ) : (
            <SimpleLineIcons name="camera" size={24} color="deepskyblue" />
          )}
        </Pressable>
        <TextInput
          ref={inputRef}
          value={entry}
          onChangeText={updateEntry}
          onSubmitEditing={() => void submit()}
          onBlur={cancelDraft}
          placeholder="Tagebucheintrag erstellen"
          returnKeyType="done"
          blurOnSubmit
          editable={!saving}
          multiline
          underlineColorAndroid="transparent"
          style={styles.input}
        />
        <Pressable
          accessibilityLabel="Alle Einträge löschen"
          onPressIn={holdDraft}
          onPress={onDelete}
          style={styles.trashIcon}>
          <SimpleLineIcons name="trash" size={24} color="deepskyblue" />
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={saving}
        onPressIn={() => {
          holdDraft();
          void submit();
        }}
        onPress={() => void submit()}
        style={[styles.addButton, saving && styles.addButtonDisabled]}>
        <Text style={styles.addButtonLabel}>{saving ? 'Wird gespeichert…' : 'Eintrag hinzufügen'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    borderColor: 'deepskyblue',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    marginTop: 8,
    padding: 8,
    gap: 8,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoIcon: {
    alignSelf: 'center',
    marginLeft: 5,
    marginRight: 15,
  },
  trashIcon: {
    alignSelf: 'center',
    marginLeft: 12,
    marginRight: 5,
  },
  imagePreview: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
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
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
