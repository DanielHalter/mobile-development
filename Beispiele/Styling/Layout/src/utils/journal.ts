export type JournalEntry = {
  text: string;
  date: number;
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
  const entry: JournalEntry = { text, date: now.getTime() };
  const [head, ...tail] = sections;

  if (!head || head.title !== today) {
    return [{ title: today, data: [entry] }, ...sections];
  }

  return [{ title: head.title, data: [entry, ...head.data] }, ...tail];
}
