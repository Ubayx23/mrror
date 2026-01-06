'use client';

import { useState, useEffect, useCallback } from 'react';
import { addSession } from '@/app/utils/sessions';
import { DashboardCard } from './DashboardGrid';

interface ActiveTaskCardV2Props {
  taskId: string;
  taskName: string;
  durationMinutes: number;
  onComplete: () => void;
  onTimerUpdate?: (display: string, isRunning: boolean) => void;
}

/**
 * Phase 4: Active task card with integrated journal nudge
 * Clean dark card with timer, progress, and quick journal input
 */
export default function ActiveTaskCardV2({
  taskId,
  taskName,
  durationMinutes,
  onComplete,
  onTimerUpdate,
}: ActiveTaskCardV2Props) {
  const totalSeconds = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [journalNote, setJournalNote] = useState('');

  const handleComplete = useCallback(() => {
    const completedSeconds = totalSeconds - remainingSeconds;
    if (completedSeconds > 0) {
      addSession(taskId, taskName, completedSeconds);
    }
    onComplete();
  }, [taskId, taskName, totalSeconds, remainingSeconds, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, handleComplete]);

  // Update parent with timer display
  useEffect(() => {
    if (onTimerUpdate) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      onTimerUpdate(display, isRunning);
    }
  }, [remainingSeconds, isRunning, onTimerUpdate]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <DashboardCard fullWidth className="lg:col-span-2">
      <div className="space-y-6">
        {/* Task header */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{taskName}</h3>
          <p className="text-sm text-neutral-400">{durationMinutes} min focus session</p>
        </div>

        {/* Timer display */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-7xl font-mono font-bold text-white mb-4">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          
          {/* Progress bar */}
          <div className="w-full max-w-md h-2 bg-neutral-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={toggleTimer}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition"
            >
              Reset
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition"
            >
              Done
            </button>
          </div>
        </div>

        {/* Journal nudge */}
        <div className="pt-6 border-t border-neutral-800">
          <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
            What are you working toward right now?
          </label>
          <textarea
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            placeholder="Quick note... (optional)"
            rows={2}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-neutral-500 mt-1">Stored locally. Not required.</p>
        </div>
      </div>
    </DashboardCard>
  );
}
