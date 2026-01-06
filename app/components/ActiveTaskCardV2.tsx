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
    <DashboardCard>
      <div className="space-y-4">
        {/* Task header */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-0.5">{taskName}</h3>
          <p className="text-xs text-neutral-500">{durationMinutes} min session</p>
        </div>

        {/* Timer display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-5xl font-mono font-bold text-white mb-3">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={toggleTimer}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-5 py-2 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition"
            >
              Reset
            </button>
            <button
              onClick={handleComplete}
              className="px-5 py-2 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
