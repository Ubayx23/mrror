'use client';

export type JournalCategory = 'Work' | 'Personal' | 'Events' | 'Education' | 'Social';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  bodyHtml: string; // stored as HTML from contentEditable
  category: JournalCategory;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const JOURNAL_STORAGE_KEY = 'mrror-journal-entries-v1';

export function getTodayDate(): string {
  // Return local date (YYYY-MM-DD) to avoid UTC off-by-one issues
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readAll(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: JournalEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export function getEntries(): JournalEntry[] {
  // newest-first by default
  return readAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getEntryById(id: string): JournalEntry | null {
  const all = readAll();
  return all.find(e => e.id === id) || null;
}

export function createEntry(category: JournalCategory = 'Personal'): JournalEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const all = readAll();
    const nowIso = new Date().toISOString();
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: getTodayDate(),
      title: '',
      bodyHtml: '',
      category,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    writeAll([entry, ...all]);
    return entry;
  } catch {
    return null;
  }
}

export function updateEntry(id: string, updates: Partial<Pick<JournalEntry, 'title' | 'bodyHtml' | 'date' | 'category'>>): JournalEntry | null {
  try {
    const all = readAll();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  } catch {
    return null;
  }
}

export function deleteEntry(id: string): boolean {
  try {
    const all = readAll();
    const next = all.filter(e => e.id !== id);
    writeAll(next);
    return true;
  } catch {
    return false;
  }
}
