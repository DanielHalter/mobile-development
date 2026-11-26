import * as Location from 'expo-location';
import { useState } from 'react';

import { ActionButton } from '@/components/action-button';
import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

const weatherLabels: Record<number, string> = {
  0: 'klar',
  1: 'überwiegend klar',
  2: 'teils bewölkt',
  3: 'bedeckt',
  45: 'Nebel',
  48: 'Nebel',
  51: 'Nieselregen',
  53: 'Nieselregen',
  55: 'Nieselregen',
  61: 'Regen',
  63: 'Regen',
  65: 'starker Regen',
  71: 'Schnee',
  73: 'Schnee',
  75: 'starker Schneefall',
  80: 'Regenschauer',
  81: 'Regenschauer',
  82: 'starke Regenschauer',
  95: 'Gewitter',
  96: 'Gewitter',
  99: 'Gewitter',
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

type Result =
  | { status: 'idle' }
  | { status: 'denied' }
  | { status: 'location-failed' }
  | { status: 'weather-failed' }
  | { status: 'ready'; weather: string; latitude: number; longitude: number };

export function LocationSection() {
  const [result, setResult] = useState<Result>({ status: 'idle' });
  const [busy, setBusy] = useState(false);

  async function showWeather() {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setResult({ status: 'denied' });
        return;
      }

      let latitude: number;
      let longitude: number;
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        latitude = coords.latitude;
        longitude = coords.longitude;
      } catch {
        setResult({ status: 'location-failed' });
        return;
      }

      try {
        const weather = await readWeather(latitude, longitude);
        setResult({ status: 'ready', weather, latitude, longitude });
      } catch {
        setResult({ status: 'weather-failed' });
      }
    } catch {
      setResult({ status: 'location-failed' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title="Standort" purpose="Eine Funktion anbieten, die den aktuellen Ort braucht.">
      <ActionButton
        label={busy ? 'Wetter wird geladen…' : 'Wetter am aktuellen Ort'}
        disabled={busy}
        onPress={() => {
          void showWeather();
        }}
      />
      {result.status === 'ready' ? (
        <>
          <InfoRow label="Wetter" value={result.weather} />
          <InfoRow label="Ort" value={`${result.latitude.toFixed(3)}, ${result.longitude.toFixed(3)}`} />
        </>
      ) : null}
      {result.status === 'denied' ? (
        <Hint>Standortzugriff verweigert. Das ist eine Ablehnung, kein technischer Fehler.</Hint>
      ) : null}
      {result.status === 'location-failed' ? (
        <Hint>Der Ort konnte technisch nicht gelesen werden. Die Berechtigung ist davon unabhängig.</Hint>
      ) : null}
      {result.status === 'weather-failed' ? (
        <Hint>Der Ort ist bekannt, das Wetter konnte nicht geladen werden.</Hint>
      ) : null}
      <Hint>Die Koordinaten dienen nur dieser Wetterabfrage und werden nicht gespeichert.</Hint>
    </Section>
  );
}

async function readWeather(latitude: number, longitude: number) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude}&longitude=${longitude}` +
    '&current=temperature_2m,weather_code&timezone=auto';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const data = (await response.json()) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== 'number') {
    throw new Error('missing');
  }
  const code = data.current?.weather_code;
  const description = typeof code === 'number' ? (weatherLabels[code] ?? 'Wetter') : 'Wetter';
  return `${Math.round(temperature)}˚C ${description}`;
}
