'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardCard } from './DashboardGrid';

const NOTES_STORAGE_KEY = 'mrror-notes-v1';

function loadNotes(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(NOTES_STORAGE_KEY) || '';
  } catch (err) {
    console.error('Error loading notes', err);
    return '';
  }
}

function saveNotes(text: string) {
  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, text);
  } catch (err) {
    console.error('Error saving notes', err);
  }
}

/**
 * Dedicated journal panel - thinking space while working
 * Auto-saves, always visible, equal importance to timer
 */
export default function NotesPanel() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveNotes(notes);
      setLastSaved(new Date());
    }, 500);

    return () => clearTimeout(timeout);
  }, [notes]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  }, []);

  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
            Journal
          </h3>
          {lastSaved && (
            <span className="text-xs text-neutral-600">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="What are you thinking about? What problems are you solving?"
          rows={10}
          className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm text-neutral-200 placeholder-neutral-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed"
        />
        
        <p className="text-xs text-neutral-600">
          Thinking space. Auto-saves as you type.
        </p>
      </div>
    </DashboardCard>
  );
}
