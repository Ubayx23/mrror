'use client';

import { useState } from 'react';
import { DashboardCard } from './DashboardGrid';

interface Habit {
  id: string;
  name: string;
  history: boolean[]; // Last 7 days, index 0 = today
}

const HABITS_STORAGE_KEY = 'mrror-habits-v1';
const HISTORY_STORAGE_KEY = 'mrror-habit-history-v1';

function loadHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HABITS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch (err) {
    console.error('Error loading habits', err);
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  try {
    window.localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.error('Error saving habits', err);
  }
}

function getLastCheckDate(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(HISTORY_STORAGE_KEY);
}

function saveLastCheckDate() {
  const today = new Date().toDateString();
  window.localStorage.setItem(HISTORY_STORAGE_KEY, today);
}

function checkAndRotateHistory(habits: Habit[]): Habit[] {
  const lastCheck = getLastCheckDate();
  const today = new Date().toDateString();
  
  if (lastCheck !== today) {
    // New day - rotate history
    const updated = habits.map(h => ({
      ...h,
      history: [false, ...h.history.slice(0, 6)] // Add new day, keep last 6
    }));
    saveLastCheckDate();
    return updated;
  }
  
  return habits;
}

/**
 * Minimal habits tracker
 * 1-3 daily toggleable habits with 7-day visual indicator
 */
export default function HabitsCard() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const loaded = loadHabits();
    return checkAndRotateHistory(loaded);
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const toggleHabit = (habitId: string) => {
    const updated = habits.map(h => 
      h.id === habitId 
        ? { ...h, history: [!h.history[0], ...h.history.slice(1)] }
        : h
    );
    setHabits(updated);
    saveHabits(updated);
  };

  const addHabit = () => {
    if (!newHabitName.trim() || habits.length >= 3) return;
    
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName.trim(),
      history: [false, false, false, false, false, false, false]
    };
    
    const updated = [...habits, newHabit];
    setHabits(updated);
    saveHabits(updated);
    setNewHabitName('');
    setIsAdding(false);
  };

  const deleteHabit = (habitId: string) => {
    const updated = habits.filter(h => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  return (
    <DashboardCard>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Habits
          </h3>
          {habits.length < 3 && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-neutral-500 hover:text-neutral-400 font-medium"
            >
              + Add
            </button>
          )}
        </div>

        {habits.length === 0 && !isAdding && (
          <p className="text-xs text-neutral-600 py-4 text-center">
            Background context. Add up to 3.
          </p>
        )}

        {isAdding && (
          <div className="space-y-2 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addHabit();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewHabitName('');
                }
              }}
              placeholder="Habit name..."
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={addHabit}
                className="px-3 py-1 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewHabitName('');
                }}
                className="px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className="flex items-center gap-2 group"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    habit.history[0]
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-neutral-600 group-hover:border-neutral-500'
                  }`}>
                    {habit.history[0] && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-neutral-300">{habit.name}</span>
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-xs text-neutral-600 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
              
              {/* 7-day indicator */}
              <div className="flex gap-1 pl-7">
                {habit.history.map((done, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition ${
                      done ? 'bg-emerald-500' : 'bg-neutral-800'
                    }`}
                    title={`${7 - idx} days ago`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {habits.length > 0 && (
          <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-800">
            Dots show last 7 days (left = today)
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
