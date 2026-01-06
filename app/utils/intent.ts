'use client';

/**
 * Intent tracking: one-line journal prompts before starting work.
 * Stores the user's answer to "what are you working on and why" for context.
 */

export interface JournalIntent {
  id: string;
  text: string;
  createdAt: string; // ISO timestamp
}

const INTENT_STORAGE_KEY = 'mrror-intent-v1';

export function loadCurrentIntent(): JournalIntent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(INTENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalIntent) : null;
  } catch (err) {
    console.error('Error loading intent', err);
    return null;
  }
}

export function saveIntent(text: string): JournalIntent {
  const intent: JournalIntent = {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(INTENT_STORAGE_KEY, JSON.stringify(intent));
    } catch (err) {
      console.error('Error saving intent', err);
    }
  }

  return intent;
}

export function clearIntent() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(INTENT_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing intent', err);
  }
}
