'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPromise, getTodayPromise, DailyPromise } from '@/app/utils/storage';
import PromiseTimerCard from '@/app/components/PromiseTimerCard';
import { DashboardCard } from './DashboardGrid';

interface DailyPromiseCardProps {
  promise?: DailyPromise | null;
  onPromiseCreated?: (promise: DailyPromise) => void;
  onPromiseChange?: (promise: DailyPromise | null) => void;
  prefillText?: string;
  attachTimer?: boolean;
}

/**
 * Phase 6: Daily Promise Card (Promise-Centric)
 * Can display a promise or show creation interface
 * Visually dominant, always at top of layout
 */
export default function DailyPromiseCard({ promise: externalPromise, onPromiseCreated, onPromiseChange, prefillText, attachTimer = false }: DailyPromiseCardProps) {
  const [todayPromise, setTodayPromise] = useState<DailyPromise | null>(() => getTodayPromise());
  const [promiseText, setPromiseText] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>();
  const [error, setError] = useState('');

  // Use external promise if explicitly provided (including null)
  // Otherwise fall back to internal state
  const displayPromise = externalPromise !== undefined ? externalPromise : todayPromise;

  useEffect(() => {
    onPromiseChange?.(displayPromise);
  }, [displayPromise, onPromiseChange]);

  // Apply prefill when provided and no current text
  useEffect(() => {
    if (!displayPromise && prefillText && !promiseText) {
      setPromiseText(prefillText);
    }
  }, [displayPromise, prefillText, promiseText]);

  const handleCommit = useCallback(() => {
    if (!promiseText.trim()) {
      setError('Promise cannot be empty');
      return;
    }

    const created = createPromise(promiseText.trim(), estimatedMinutes || undefined);
    if (created) {
      setTodayPromise(created);
      setPromiseText('');
      setEstimatedMinutes(undefined);
      setError('');
      onPromiseCreated?.(created);
      onPromiseChange?.(created);
    } else {
      setError('Failed to create promise');
    }
  }, [promiseText, estimatedMinutes, onPromiseCreated, onPromiseChange]);

  if (displayPromise) {
    return (
      <DashboardCard className={displayPromise.state === 'pending' ? 'border-blue-700 shadow-lg' : displayPromise.state === 'completed' ? 'border-emerald-700' : 'border-red-700'}>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Your Statement</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              displayPromise.state === 'completed' ? 'bg-green-950/50 text-green-300 border border-green-900' :
              displayPromise.state === 'failed' ? 'bg-red-950/50 text-red-300 border border-red-900' :
              'bg-blue-950/50 text-blue-300 border border-blue-900'
            }`}>
              {displayPromise.state === 'completed' ? '✓ Kept' :
               displayPromise.state === 'failed' ? '✗ Broken' :
               'Active'}
            </span>
          </div>

          {/* The Promise - Dominant Visual Element */}
          <div className="bg-neutral-800/30 border-l-4 border-blue-500 rounded-r-lg px-6 py-5">
            <p className="text-white text-2xl leading-relaxed font-medium tracking-tight">
              {displayPromise.promise}
            </p>
            {displayPromise.estimatedMinutes && (
              <p className="text-neutral-400 text-sm mt-3">
                ~{displayPromise.estimatedMinutes} minutes
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Committed {new Date(displayPromise.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {displayPromise.completedAt && (
              <span>Resolved {new Date(displayPromise.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>

          {displayPromise.state === 'pending' && attachTimer && (
            <PromiseTimerCard promise={displayPromise} embedded onTimerComplete={() => {}} onTimerUpdate={() => {}} />
          )}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Make Your Statement</h3>
          <p className="text-sm text-neutral-400">
            What will you commit to today?
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              I will…
            </label>
            <input
              type="text"
              value={promiseText}
              onChange={(e) => {
                setPromiseText(e.target.value);
                setError('');
              }}
              placeholder="Be specific. Be finishable."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-base placeholder-neutral-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Estimated time (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={estimatedMinutes || ''}
                onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="25"
                min="1"
                max="480"
                className="w-24 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-600 transition"
              />
              <span className="text-sm text-neutral-400">minutes</span>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/50 border border-red-900 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCommit}
            disabled={!promiseText.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed transition"
          >
            Commit to Statement
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
