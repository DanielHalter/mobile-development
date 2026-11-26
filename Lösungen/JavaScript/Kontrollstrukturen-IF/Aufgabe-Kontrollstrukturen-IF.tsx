import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ExampleField } from '@/components/example-field';
import { ExampleScreen } from '@/components/example-screen';
import { Spacing, useTheme } from '@/constants/theme';

export default function AufgabeKontrollstrukturenIf() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dialog, setDialog] = useState<string | null>(null);

  function validateForm() {
    if (name === '' || Number(age) < 18) {
      console.log('Fehlerfall: Name ' + name);
      console.log('Fehlerfall: Alter ' + age);
      setDialog('Eingabe nicht gültig. Name muss vorhanden sein u. Alter größer als 18.');
      return;
    }
    setDialog('Formular fehlerlos.');
  }

  return (
    <>
      <ExampleScreen
        title="Lösung: if"
        intro="Dieselbe Prüfung wie in Javascript/Lösungen/Kontrollstrukturen-IF: Name leer oder Alter unter 18 ist ungültig.">
        <ExampleField label="Name" value={name} onChangeText={setName} placeholder="Name" />
        <ExampleField label="Alter" value={age} onChangeText={setAge} keyboard="numeric" placeholder="Alter" />
        <Pressable
          onPress={validateForm}
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

const styles = StyleSheet.create({
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
