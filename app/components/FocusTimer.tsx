'use client';

import { useEffect, useMemo, useState } from 'react';

const DEFAULT_SESSION_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// A simple focus timer with start/pause/reset controls.
export default function FocusTimer() {
  const [remaining, setRemaining] = useState(DEFAULT_SESSION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  // Memoized label so we don't recompute on every render.
  const timeLabel = useMemo(() => formatTime(remaining), [remaining]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    };

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const handleStart = () => {
    if (remaining === 0) setRemaining(DEFAULT_SESSION_SECONDS);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(DEFAULT_SESSION_SECONDS);
  };

  return (
    <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Focus timer</h2>
        <p className="text-sm text-neutral-500">Default 25-minute session. Start, pause, or reset anytime.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-4xl sm:text-5xl font-semibold tabular-nums tracking-tight" aria-live="polite">
          {timeLabel}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleStart}
          className="px-4 py-2 rounded-lg border border-neutral-200 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
          disabled={isRunning && remaining > 0}
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-100 transition"
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-100 transition"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
