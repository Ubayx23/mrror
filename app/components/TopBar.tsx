'use client';

import { useEffect, useState } from 'react';
import { getFireStreak } from '@/app/utils/storage';
interface TopBarProps {
  activeTaskName?: string; // retained for backward compat, not shown
  timerDisplay?: string;
  isTimerRunning?: boolean;
  minutesToday: number;
}

/**
 * Phase 4: Top system bar
 * Always visible, shows app name, active timer status, and session info
 */
export default function TopBar({ 
  // activeTaskName intentionally not displayed to reduce clutter
  timerDisplay, 
  isTimerRunning,
  minutesToday 
}: TopBarProps) {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    setStreak(getFireStreak());
  }, []);
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-neutral-900 border-b border-neutral-800 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: App name */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-lg font-semibold text-white tracking-tight">mrror</h1>
        </div>

        {/* Right: Fire streak + timer + today minutes */}
        <div className="flex items-center gap-4">
          {/* Fire streak with custom tooltip */}
          <div className="group relative flex items-center gap-1 px-2 py-1 rounded bg-neutral-800/50">
            <span className="text-orange-400" aria-label="Fire streak">🔥</span>
            <span className="text-xs text-neutral-300">{streak}</span>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-800 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-neutral-700">
              Consecutive days opened
            </span>
          </div>
          {/* Timer with custom tooltip */}
          {timerDisplay && (
            <div className="group relative">
              <div
                className={`text-sm font-mono font-semibold ${
                  isTimerRunning ? 'text-emerald-400' : 'text-neutral-400'
                }`}
              >
                {timerDisplay}
              </div>
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-800 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-neutral-700">
                Minutes focused today
              </span>
            </div>
          )}
          <div className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/50">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Today</span>
            <span className="text-sm font-semibold text-emerald-400">{minutesToday}m</span>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-800 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-neutral-700">
              Minutes focused today
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
