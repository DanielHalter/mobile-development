export type JournalEntry = {
  text: string;
  date: number;
  isFavorite: boolean;
};

export type JournalSection = {
  title: string;
  data: JournalEntry[];
};

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat('de-CH', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function addJournalEntry(
  sections: JournalSection[],
  text: string,
  now = new Date(),
): JournalSection[] {
  const today = formatDay(now);
  // Neue Einträge sind standardmässig keine Favoriten
  const entry: JournalEntry = { text, date: now.getTime(), isFavorite: false };
  const [head, ...tail] = sections;

  if (!head || head.title !== today) {
    return [{ title: today, data: [entry] }, ...sections];
  }

  return [{ title: head.title, data: [entry, ...head.data] }, ...tail];
}

/** Schaltet die Favoritenmarkierung eines Eintrags um (immutable). date dient als ID. */
export function toggleFavorite(sections: JournalSection[], date: number): JournalSection[] {
  return sections.map((section) => ({
    ...section,
    data: section.data.map((entry) =>
      entry.date === date ? { ...entry, isFavorite: !entry.isFavorite } : entry,
    ),
  }));
}

/** Liefert nur Favoriten; leere Tages-Sections werden entfernt. State bleibt unverändert. */
export function filterFavorites(sections: JournalSection[]): JournalSection[] {
  return sections
    .map((section) => ({ ...section, data: section.data.filter((e) => e.isFavorite) }))
    .filter((section) => section.data.length > 0);
}

export function countEntries(sections: JournalSection[]): number {
  return sections.reduce((sum, section) => sum + section.data.length, 0);
}

export function countFavorites(sections: JournalSection[]): number {
  return sections.reduce(
    (sum, section) => sum + section.data.filter((e) => e.isFavorite).length,
    0,
  );
}