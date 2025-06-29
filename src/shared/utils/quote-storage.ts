export interface QuoteStorageData {
  quote: string;
  author: string;
  date: string;
}

const QUOTE_STORAGE_KEY = 'yourEnergy.quote';

export function saveQuote(data: QuoteStorageData): void {
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(data));
}

export function loadQuote(): QuoteStorageData | null {
  const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
