import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';

import { ActionButton } from '@/components/action-button';
import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

export function BatterySection() {
  const [level, setLevel] = useState<number | null>(null);
  const [download, setDownload] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Battery.getBatteryLevelAsync()
      .then((next) => {
        if (active) {
          setLevel(next);
        }
      })
      .catch(() => {
        if (active) {
          setLevel(-1);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Section title="Akku" purpose="Optionale Arbeit anpassen, wenn eine Funktion viel Energie braucht.">
      <InfoRow label="Akkustand" value={formatLevel(level)} />
      {level == null ? null : <Hint>{decision(level)}</Hint>}
      <ActionButton
        label="Langer Download starten"
        disabled={level == null}
        onPress={() => {
          setDownload(downloadResult(level));
        }}
      />
      {download ? <Hint>{download}</Hint> : null}
    </Section>
  );
}

function formatLevel(level: number | null) {
  if (level == null) {
    return '…';
  }
  if (level < 0) {
    return 'nicht verfügbar';
  }
  return `${Math.round(level * 100)} %`;
}

function decision(level: number) {
  if (level < 0) {
    return 'Akkustand nicht verfügbar. Der lange Download startet trotzdem.';
  }
  if (level < 0.15) {
    return 'Unter 15 %. Der lange Download wird verschoben.';
  }
  return 'Der lange Download kann jetzt starten.';
}

function downloadResult(level: number | null) {
  if (level != null && level >= 0 && level < 0.15) {
    return 'Verschoben. Der lange Download wartet auf einen höheren Akkustand.';
  }
  return 'Der lange Download startet.';
}
