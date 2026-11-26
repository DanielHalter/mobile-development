import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState, type ComponentRef } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type JournalItemInputProps = {
  onSubmit: (text: string, photo: string | null) => void;
};

export function JournalItemInput({ onSubmit }: JournalItemInputProps) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const keepUntil = useRef(0);
  const entryRef = useRef('');
  const photoRef = useRef<string | null>(null);
  const [entry, setEntry] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

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
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (result.canceled || !result.assets[0]) {
      return;
    }
    updatePhoto(result.assets[0].uri);
    inputRef.current?.focus();
  }

  function holdDraft() {
    keepUntil.current = Date.now() + 300;
  }

  function submit() {
    holdDraft();
    const text = entryRef.current.trim();
    const currentPhoto = photoRef.current;
    if (!text) {
      return;
    }
    onSubmit(text, currentPhoto);
    clearDraft();
  }

  function cancelDraft() {
    setTimeout(() => {
      if (Date.now() < keepUntil.current) {
        return;
      }
      clearDraft();
    }, 0);
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
          onSubmitEditing={submit}
          onBlur={cancelDraft}
          placeholder="Tagebucheintrag erstellen"
          returnKeyType="done"
          blurOnSubmit
          multiline
          underlineColorAndroid="transparent"
          style={styles.input}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        onPressIn={() => {
          holdDraft();
          submit();
        }}
        onPress={submit}
        style={styles.addButton}>
        <Text style={styles.addButtonLabel}>Eintrag hinzufügen</Text>
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
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
