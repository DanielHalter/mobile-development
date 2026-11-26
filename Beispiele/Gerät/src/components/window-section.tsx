import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

const photos = [
  { title: 'Foto 1', color: '#8ecae6' },
  { title: 'Foto 2', color: '#f4a261' },
  { title: 'Foto 3', color: '#90be6d' },
  { title: 'Foto 4', color: '#c9ada7' },
];

export function WindowSection() {
  const { width, height, fontScale } = useWindowDimensions();
  const showTwoColumns = width >= 600;

  return (
    <Section title="Fenstergrösse" purpose="Die tatsächlich verfügbare App-Fläche berücksichtigen.">
      <InfoRow label="Breite" value={`${Math.round(width)}`} />
      <InfoRow label="Höhe" value={`${Math.round(height)}`} />
      <InfoRow label="Schriftvergrösserung" value={fontScale.toFixed(2)} />
      <InfoRow label="Galerielayout" value={showTwoColumns ? 'zwei Spalten' : 'eine Spalte'} />
      <View style={styles.gallery}>
        {photos.map((photo) => (
          <View
            key={photo.title}
            style={[styles.tile, { backgroundColor: photo.color, flexBasis: showTwoColumns ? '40%' : '100%' }]}
          >
            <Text style={styles.tileLabel}>{photo.title}</Text>
          </View>
        ))}
      </View>
      <Hint>
        Die Fensterbreite misst den Platz, der gerade da ist. Der Modellname bleibt gleich, wenn man das Gerät dreht oder das Fenster teilt. fontScale ist die Schriftvergrösserung aus den Systemeinstellungen.
      </Hint>
    </Section>
  );
}

const styles = StyleSheet.create({
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    flexGrow: 1,
    height: 72,
    borderRadius: 8,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 15,
    color: '#1c1c1e',
  },
});
