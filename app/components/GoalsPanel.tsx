'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardGrid';

const GOALS_KEY = 'mrror-goals-v2';

interface Goal { id: string; text: string; done: boolean; }

function loadGoals(): Goal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(GOALS_KEY);
    if (!raw) {
      // migrate from v1 if present
      const legacy = window.localStorage.getItem('mrror-goals-v1');
      if (!legacy) return [];
      try {
        const parsed = JSON.parse(legacy) as Array<{ id: string; text: string }>;
        const migrated: Goal[] = parsed.map(g => ({ ...g, done: false }));
        window.localStorage.setItem(GOALS_KEY, JSON.stringify(migrated));
        return migrated;
      } catch { return []; }
    }
    const parsed = JSON.parse(raw) as Goal[];
    return parsed.map(g => ({ ...g, done: !!(g as any).done }));
  } catch { return []; }
}

function saveGoals(goals: Goal[]) {
  try { window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch {}
}

export default function GoalsPanel({ onPrefill }: { onPrefill?: (text: string) => void }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => { setGoals(loadGoals()); }, []);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    const next = [{ id: crypto.randomUUID(), text: t, done: false }, ...goals].slice(0, 10);
    setGoals(next); saveGoals(next); setText(''); setAdding(false);
  };

  const del = (id: string) => {
    const next = goals.filter(g => g.id !== id);
    setGoals(next); saveGoals(next);
  };

  const toggle = (id: string) => {
    const next = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(next); saveGoals(next);
  };

  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Goals</h3>
          {!adding && (
            <button onClick={() => setAdding(true)} className="text-xs text-neutral-500 hover:text-neutral-300">+ Add</button>
          )}
        </div>

        {adding && (
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
              placeholder="Long-term goal..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') add(); if (e.key === 'Escape') { setAdding(false); setText(''); } }}
            />
            <button onClick={add} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium">Save</button>
          </div>
        )}

        <div className="space-y-2">
          {goals.length === 0 && !adding && (
            <p className="text-xs text-neutral-600">Add a few long-term goals. Clicking one will prefill your statement.</p>
          )}
          {goals.map(g => (
            <div key={g.id} className="flex items-center justify-between p-2 rounded hover:bg-neutral-900/60">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={g.done}
                  onChange={() => toggle(g.id)}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  aria-label={g.done ? 'Mark goal incomplete' : 'Mark goal complete'}
                />
                <button
                  className={`text-left text-sm ${g.done ? 'text-neutral-500 line-through' : 'text-neutral-200 hover:text-white'}`}
                  onClick={() => onPrefill?.(g.text)}
                  title="Prefill statement"
                >
                  {g.text}
                </button>
              </div>
              <button className="text-xs text-neutral-500 hover:text-red-400" onClick={() => del(g.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
