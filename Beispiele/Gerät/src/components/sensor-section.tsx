import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

type Axes = {
  x: number;
  y: number;
  z: number;
};

export function SensorSection() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [acceleration, setAcceleration] = useState<Axes | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    let active = true;

    void Accelerometer.isAvailableAsync()
      .then((isAvailable) => {
        if (!active) {
          return;
        }
        setAvailable(isAvailable);
        if (!isAvailable) {
          return;
        }
        if (process.env.EXPO_OS !== 'web') {
          Accelerometer.setUpdateInterval(250);
        }
        subscription = Accelerometer.addListener((measurement) => {
          setAcceleration({ x: measurement.x, y: measurement.y, z: measurement.z });
        });
      })
      .catch(() => {
        if (active) {
          setAvailable(false);
        }
      });

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  const x = acceleration?.x ?? 0;
  const y = acceleration?.y ?? 0;

  return (
    <Section title="Sensoren" purpose="Veränderungen beobachten, etwa die Bewegung des Geräts.">
      <InfoRow label="Beschleunigungssensor" value={availabilityLabel(available)} />
      {available ? (
        <>
          <InfoRow label="x" value={axis(acceleration?.x)} />
          <InfoRow label="y" value={axis(acceleration?.y)} />
          <InfoRow label="z" value={axis(acceleration?.z)} />
          <View style={styles.pad}>
            <View
              style={[
                styles.dot,
                {
                  left: `${clampUnit(x) * 100}%`,
                  top: `${clampUnit(-y) * 100}%`,
                },
              ]}
            />
          </View>
        </>
      ) : null}
      <Hint>
        Eine Versionsnummer wird einmal gelesen. Bewegungsdaten kommen fortlaufend. Der Listener endet, wenn dieser Screen nicht mehr gebraucht wird.
      </Hint>
    </Section>
  );
}

function availabilityLabel(available: boolean | null) {
  if (available == null) {
    return '…';
  }
  return available ? 'verfügbar' : 'nicht verfügbar';
}

function axis(value: number | undefined) {
  if (value === undefined) {
    return '…';
  }
  return value.toFixed(2);
}

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, (value + 1) / 2));
}

const styles = StyleSheet.create({
  pad: {
    height: 120,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
  },
  dot: {
    position: 'absolute',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 8,
    backgroundColor: 'deepskyblue',
  },
});
