'use client';

import { useEffect, useMemo, useState } from 'react';
import { addSession } from '@/app/utils/sessions';

const DEFAULT_SESSION_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

interface ActiveTaskCardProps {
  taskId: string;
  taskName: string;
  durationMinutes: number;
  onComplete: () => void;
}

/**
 * Centered execution card with active task name, duration, and bound timer.
 * Shows start/pause/complete actions.
 */
export default function ActiveTaskCard({
  taskId,
  taskName,
  durationMinutes,
  onComplete,
}: ActiveTaskCardProps) {
  const durationSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const timeLabel = useMemo(() => formatTime(remaining), [remaining]);
  const progressPercent = Math.round(((durationSeconds - remaining) / durationSeconds) * 100);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          addSession(taskId, taskName, durationSeconds);
          return 0;
        }
        return prev - 1;
      });
    };

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, taskId, taskName, durationSeconds]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleComplete = () => {
    setIsRunning(false);
    if (remaining > 0) {
      addSession(taskId, taskName, durationSeconds - remaining);
    }
    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
              {taskName}
            </h2>
            <p className="text-sm text-neutral-500">{durationMinutes} minute session</p>
          </div>

          <div className="relative bg-neutral-50 rounded-2xl p-8 sm:p-12 border border-neutral-200 shadow-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-neutral-100/50 to-transparent opacity-50 pointer-events-none" />

            <div className="relative space-y-4">
              <div className="text-6xl sm:text-7xl font-semibold tabular-nums tracking-tight text-center text-neutral-900">
                {timeLabel}
              </div>

              <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStart}
            disabled={isRunning}
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 transition"
          >
            Start
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={!isRunning}
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 text-neutral-900 font-medium text-sm hover:bg-neutral-50 disabled:opacity-50 transition"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 text-neutral-900 font-medium text-sm hover:bg-neutral-50 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
