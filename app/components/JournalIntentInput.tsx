'use client';

import { useState, FormEvent } from 'react';
import { loadCurrentIntent, saveIntent } from '@/app/utils/intent';

interface JournalIntentInputProps {
  isHidden?: boolean;
}

/**
 * Lightweight intent prompt at the top of the home screen.
 * "What are you working on right now, and why does it matter?"
 * Stores one-liner locally. Shows after submission.
 */
export default function JournalIntentInput({ isHidden = false }: JournalIntentInputProps) {
  const [intent, setIntent] = useState('');
  const [currentIntent, setCurrentIntent] = useState<string | null>(() => {
    const loaded = loadCurrentIntent();
    return loaded ? loaded.text : null;
  });
  const [isEditing, setIsEditing] = useState(() => {
    const loaded = loadCurrentIntent();
    return !loaded;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;
    saveIntent(intent.trim());
    setCurrentIntent(intent.trim());
    setIntent('');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIntent(currentIntent || '');
    setIsEditing(true);
  };

  if (isHidden) return null;

  return (
    <div className="w-full">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="intent" className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Your intent
          </label>
          <input
            id="intent"
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="What are you working on right now, and why does it matter?"
            autoFocus
            maxLength={120}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
          >
            Set intent
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Your intent</p>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
            <p className="text-sm text-neutral-800">{currentIntent}</p>
          </div>
          <button
            type="button"
            onClick={handleEdit}
            className="text-xs text-neutral-500 hover:text-neutral-700 underline"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
