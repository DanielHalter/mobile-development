import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ExampleField } from '@/components/example-field';
import { ExampleScreen } from '@/components/example-screen';
import { Spacing, useTheme } from '@/constants/theme';

const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
const phonePattern = /^[0-9]+$/;

export default function FormularValidierung() {
  const theme = useTheme();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
  });
  const [dialog, setDialog] = useState<string | null>(null);

  function submit() {
    const next = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      message: '',
    };
    let isValid = true;

    if (firstname === '') {
      next.firstname = 'Bitte Vornamen eingeben.';
      isValid = false;
    }
    if (lastname === '') {
      next.lastname = 'Bitte Nachnamen eingeben.';
      isValid = false;
    }
    if (email === '') {
      next.email = 'Bitte E-Mail-Adresse eingeben.';
      isValid = false;
    } else if (!email.match(emailPattern)) {
      next.email = 'Bitte eine gültige E-Mail-Adresse eingeben.';
      isValid = false;
    }
    if (phone === '') {
      next.phone = 'Bitte Telefonnummer eingeben.';
      isValid = false;
    } else if (!phone.match(phonePattern)) {
      next.phone = 'Bitte nur Ziffern eingeben.';
      isValid = false;
    }
    if (message === '') {
      next.message = 'Bitte eine Nachricht eingeben.';
      isValid = false;
    }

    setErrors(next);
    if (isValid) {
      setDialog('Formular erfolgreich abgeschickt!');
    }
  }

  return (
    <>
      <ExampleScreen
        title="Lösung: Formular"
        intro="Dieselbe Validierung wie in Javascript/Lösungen/FormularValidierung. Jedes Feld hat eine eigene Fehlermeldung.">
        <ExampleField label="Vorname" value={firstname} onChangeText={setFirstname} />
        <ErrorText text={errors.firstname} />
        <ExampleField label="Nachname" value={lastname} onChangeText={setLastname} />
        <ErrorText text={errors.lastname} />
        <ExampleField label="E-Mail" value={email} onChangeText={setEmail} />
        <ErrorText text={errors.email} />
        <ExampleField label="Telefonnummer" value={phone} onChangeText={setPhone} keyboard="numeric" />
        <ErrorText text={errors.phone} />
        <View style={{ gap: Spacing.one }}>
          <Text style={{ color: theme.label, fontSize: 14 }}>Nachricht</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            style={[
              styles.area,
              { color: theme.label, backgroundColor: theme.secondarySystemBackground },
            ]}
          />
        </View>
        <ErrorText text={errors.message} />
        <Pressable
          onPress={submit}
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
          ]}>
          <Text style={[styles.keyLabel, { color: theme.label }]}>Absenden</Text>
        </Pressable>
      </ExampleScreen>

      <Modal visible={dialog != null} transparent animationType="fade" onRequestClose={() => setDialog(null)}>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: theme.secondarySystemBackground }]}>
            <Text style={[styles.message, { color: theme.label }]}>{dialog}</Text>
            <Pressable
              onPress={() => setDialog(null)}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.systemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ErrorText({ text }: { text: string }) {
  if (text === '') {
    return null;
  }
  return <Text style={{ color: '#d70015' }}>{text}</Text>;
}

const styles = StyleSheet.create({
  area: {
    minHeight: 96,
    borderRadius: Spacing.two,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  key: {
    minHeight: 56,
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  keyLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
});
