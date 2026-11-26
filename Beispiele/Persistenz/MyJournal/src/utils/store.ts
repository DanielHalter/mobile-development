import 'expo-sqlite/localStorage/install';

import { type JournalEntry } from '@/utils/journal';

const ITEMS_KEY = 'MYJOURNAL_ITEMS';

function parseItems(json: string | null): JournalEntry[] {
  if (!json) {
    return [];
  }

  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((value) => {
    if (!value || typeof value !== 'object') {
      return [];
    }
    const item = value as Partial<JournalEntry>;
    if (typeof item.text !== 'string' || typeof item.date !== 'number') {
      return [];
    }
    return [
      {
        text: item.text,
        date: item.date,
        isFavorite: item.isFavorite === true,
        photo: typeof item.photo === 'string' ? item.photo : null,
        location: typeof item.location === 'string' ? item.location : null,
        weather: typeof item.weather === 'string' ? item.weather : null,
      },
    ];
  });
}

export class Store {
  static async loadItems(): Promise<JournalEntry[]> {
    try {
      return parseItems(localStorage.getItem(ITEMS_KEY));
    } catch (error) {
      console.error('Error loading journal items.', error);
      return [];
    }
  }

  static async saveItems(items: JournalEntry[]): Promise<void> {
    try {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving journal items.', error);
    }
  }

  static async deleteItems(): Promise<void> {
    try {
      localStorage.removeItem(ITEMS_KEY);
    } catch (error) {
      console.error('Error deleting journal items.', error);
    }
  }
}
