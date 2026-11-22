import { useNetworkState } from 'expo-network';
import { useState } from 'react';

import { ActionButton } from '@/components/action-button';
import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

const typeLabels: Record<string, string> = {
  WIFI: 'WLAN',
  CELLULAR: 'Mobilfunk',
  NONE: 'keine',
  UNKNOWN: 'unbekannt',
  BLUETOOTH: 'Bluetooth',
  ETHERNET: 'Ethernet',
  VPN: 'VPN',
  OTHER: 'andere',
  WIMAX: 'WiMAX',
};

export function NetworkSection() {
  const state = useNetworkState();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const offline = state.isConnected === false;

  async function saveCentrally() {
    if (busy) {
      return;
    }
    if (offline) {
      setMessage('Offline. Der Entwurf bleibt erhalten. Bereits gespeicherte Einträge bleiben lesbar.');
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('https://api.github.com', { signal: AbortSignal.timeout(8000) });
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      setMessage('Die Gegenstelle hat geantwortet. Eine bestehende Verbindung garantiert das nicht.');
    } catch {
      setMessage('Der Aufruf ist fehlgeschlagen. Der Entwurf bleibt erhalten.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title="Netzwerk" purpose="Einen passenden Hinweis anzeigen, bevor eine Online-Funktion läuft.">
      <InfoRow label="Verbunden" value={yesNo(state.isConnected)} />
      <InfoRow label="Internet erreichbar" value={yesNo(state.isInternetReachable)} />
      <InfoRow label="Verbindungsart" value={typeLabel(state.type)} />
      {offline ? (
        <Hint>Offline-Hinweis: Zentral speichern ist jetzt nicht möglich. Der Entwurf bleibt erhalten.</Hint>
      ) : null}
      {state.isConnected === true && state.isInternetReachable === false ? (
        <Hint>WLAN verbunden heisst nicht, dass die eigene API erreichbar ist.</Hint>
      ) : null}
      <ActionButton
        label={busy ? 'Speichern…' : 'Zentral speichern'}
        disabled={busy}
        onPress={() => {
          void saveCentrally();
        }}
      />
      {message ? <Hint>{message}</Hint> : null}
    </Section>
  );
}

function yesNo(value: boolean | null | undefined) {
  if (value == null) {
    return '…';
  }
  return value ? 'ja' : 'nein';
}

function typeLabel(type: string | null | undefined) {
  if (!type) {
    return '…';
  }
  return typeLabels[type] ?? type;
}
