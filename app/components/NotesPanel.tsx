'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyPromise } from '@/app/utils/storage';
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

interface NotesPanelProps {
  showPrompt?: 'idle' | 'waiting' | 'active' | 'reflection';
  promise?: DailyPromise | null;
}

/**
 * Phase 6: Reflection Journal
 * Dynamic prompt based on promise state
 * Idle: Waiting for promise
 * Waiting: Promise committed but timer hasn't started
 * Active: Timer is running
 * Reflection: After promise is resolved (kept or broken)
 */
export default function NotesPanel({ showPrompt = 'idle', promise }: NotesPanelProps) {
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

  const getPromptText = () => {
    switch (showPrompt) {
      case 'active':
        return 'How is the work going?';
      case 'waiting':
        return 'What will you prove today?';
      case 'reflection':
        return promise?.state === 'completed' 
          ? 'What did you learn from keeping your word?' 
          : 'What happened? What would have helped?';
      case 'idle':
      default:
        return 'Reflection space. Make a statement to begin.';
    }
  };

  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
            Reflection
          </h3>
          {lastSaved && (
            <span className="text-xs text-neutral-600">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <p className="text-xs text-neutral-500 italic">
          {getPromptText()}
        </p>

        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="Your thoughts…"
          rows={8}
          disabled={showPrompt === 'idle'}
          className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm text-neutral-200 placeholder-neutral-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <p className="text-xs text-neutral-600">
          Auto-saves as you type.
        </p>
      </div>
    </DashboardCard>
  );
}
