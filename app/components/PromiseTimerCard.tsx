'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyPromise } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';

const TIMER_PRESETS = [15, 25, 45, 60];

interface PromiseTimerCardProps {
  promise: DailyPromise;
  onTimerComplete?: () => void;
  onTimerUpdate?: (display: string, isRunning: boolean) => void;
}

/**
 * Phase 6: Promise Timer Card (Compact Supporting Tool)
 * Timer is no longer the hero - it supports the promise
 * Reduced visual dominance, smaller font sizes, more efficient layout
 */
export default function PromiseTimerCard({ promise, onTimerComplete, onTimerUpdate }: PromiseTimerCardProps) {
  const estimatedSeconds = (promise.estimatedMinutes || 25) * 60;
  const [totalSeconds, setTotalSeconds] = useState(estimatedSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(estimatedSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  // Format time
  const timeLabel = useMemo(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [remainingSeconds]);

  // Progress percentage
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Timer loop
  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimerComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, onTimerComplete]);

  // Notify parent of timer state
  useEffect(() => {
    onTimerUpdate?.(timeLabel, isRunning);
  }, [timeLabel, isRunning, onTimerUpdate]);

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handlePresetClick = useCallback((minutes: number) => {
    if (isRunning) return;
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setCustomMinutes('');
  }, [isRunning]);

  const handleCustomMinutes = useCallback(() => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins <= 480) {
      const seconds = mins * 60;
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setCustomMinutes('');
    }
  }, [customMinutes]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  return (
    <DashboardCard>
      <div className="space-y-3">
        {/* Header - stepped down from promise */}
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Work Session</h3>
          <span className="text-xs text-neutral-500">Supporting tool</span>
        </div>

        {/* Timer display - compact but clear */}
        <div className="flex items-center justify-center py-4">
          <div className="text-5xl font-mono font-bold text-white tabular-nums tracking-tight">
            {timeLabel}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls - compact horizontal layout */}
        <div className="flex gap-2 justify-center pt-1">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded font-medium text-sm transition ${
              isRunning
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded text-sm border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition font-medium"
          >
            Reset
          </button>
        </div>

        {/* Presets - more compact */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">Quick durations</p>
          <div className="flex flex-wrap gap-1.5">
            {TIMER_PRESETS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => handlePresetClick(minutes)}
                disabled={isRunning}
                className="px-2.5 py-1 text-xs rounded bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition border border-neutral-700"
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>

        {/* Custom input - minimal */}
        <div className="flex gap-1.5">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Custom"
            min="1"
            max="480"
            disabled={isRunning}
            className="flex-1 px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition disabled:opacity-50"
          />
          <button
            onClick={handleCustomMinutes}
            disabled={isRunning || !customMinutes}
            className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition border border-neutral-700"
          >
            Set
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
