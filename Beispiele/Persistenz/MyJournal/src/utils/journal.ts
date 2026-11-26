export type JournalEntry = {
  text: string;
  date: number;
  isFavorite: boolean;
  photo: string | null;
  location: string | null;
  weather: string | null;
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

export function sectionsFromEntries(items: JournalEntry[]): JournalSection[] {
  const sections: JournalSection[] = [];

  for (const item of items) {
    const title = formatDay(new Date(item.date));
    const last = sections[sections.length - 1];
    if (last && last.title === title) {
      last.data.push(item);
    } else {
      sections.push({ title, data: [item] });
    }
  }

  return sections;
}

export function toggleFavorite(items: JournalEntry[], date: number): JournalEntry[] {
  return items.map((item) =>
    item.date === date ? { ...item, isFavorite: !item.isFavorite } : item,
  );
}

export function favoriteSections(sections: JournalSection[]): JournalSection[] {
  return sections
    .map((section) => ({
      ...section,
      data: section.data.filter((item) => item.isFavorite),
    }))
    .filter((section) => section.data.length > 0);
}
