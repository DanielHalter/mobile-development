import { getLocales } from 'expo-localization';

import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

const createdAt = Date.UTC(2026, 10, 22, 8, 15);

export function LocaleSection() {
  const locale = getLocales()[0]?.languageTag ?? 'de-CH';
  const label = formatCreatedAt(locale);

  return (
    <Section title="Lokalisierung" purpose="Daten in einem vertrauten Format anzeigen.">
      <InfoRow label="Sprache und Region" value={locale} />
      <InfoRow label="Gespeicherter Zeitstempel" value={String(createdAt)} />
      <InfoRow label="Angezeigtes Datum" value={label} />
      <Hint>
        Im Datensatz bleibt der Zeitstempel. Dieselbe Zahl kann auf einem anderen Gerät anders formatiert erscheinen. Eine Spracheinstellung ist keine Standortbestimmung.
      </Hint>
    </Section>
  );
}

function formatCreatedAt(locale: string) {
  const date = new Date(createdAt);
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
  } catch {
    return new Intl.DateTimeFormat('de-CH', { dateStyle: 'medium' }).format(date);
  }
}
