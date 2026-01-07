'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DailyPromise } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';
import { playNotificationChime, playAlertChime, createBackgroundTone, stopBackgroundTone, closeAudioContext } from '@/app/utils/audio';

const TIMER_PRESETS = [15, 25, 45, 60];

interface PromiseTimerCardProps {
  promise: DailyPromise;
  onTimerComplete?: () => void;
  onTimerUpdate?: (display: string, isRunning: boolean) => void;
  embedded?: boolean; // when true, render without card wrapper for attachment
  stopSignal?: number; // external signal to stop the timer
}

/**
 * Phase 6: Promise Timer Card (Compact Supporting Tool)
 * Timer is no longer the hero - it supports the promise
 * Reduced visual dominance, smaller font sizes, more efficient layout
 */
export default function PromiseTimerCard({ promise, onTimerComplete, onTimerUpdate, embedded = false, stopSignal = 0 }: PromiseTimerCardProps) {
  const estimatedSeconds = (promise.estimatedMinutes || 25) * 60;
  const [totalSeconds, setTotalSeconds] = useState(estimatedSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(estimatedSeconds);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showDurationPanel, setShowDurationPanel] = useState(false);
  const [hasNotifiedFive, setHasNotifiedFive] = useState(false);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(0);
  const [nextBreakAt, setNextBreakAt] = useState<number | null>(estimatedSeconds > 1800 ? 1800 : null);

  // Audio handling
  const bgAudioRef = useRef<[OscillatorNode, GainNode] | null>(null);

  // Format time
  const timeLabel = useMemo(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [remainingSeconds]);

  const breakLabel = useMemo(() => {
    const mins = Math.floor(breakRemainingSeconds / 60);
    const secs = breakRemainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [breakRemainingSeconds]);

  // Progress percentage
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const startBackgroundAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (bgAudioRef.current) return; // Already playing
    bgAudioRef.current = createBackgroundTone();
  }, []);

  const stopBackgroundAudio = useCallback(() => {
    if (bgAudioRef.current) {
      const [osc, gain] = bgAudioRef.current;
      stopBackgroundTone(osc, gain);
      bgAudioRef.current = null;
    }
  }, []);

  // Timer loop
  // Timer loops for focus/break phases
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (phase === 'focus') {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      } else {
        setBreakRemainingSeconds((prev) => Math.max(0, prev - 1));
      }
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, phase]);

  // Notify parent of timer state
  // Notify parent of timer state
  useEffect(() => {
    onTimerUpdate?.(timeLabel, isRunning);
  }, [timeLabel, isRunning, onTimerUpdate]);

  // External stop (e.g., Mark Done clicked)
  // External stop (e.g., Mark Done clicked)
  useEffect(() => {
    if (stopSignal > 0) {
      setIsRunning(false);
      stopBackgroundAudio();
    }
  }, [stopSignal, stopBackgroundAudio]);

  // Completion detection
  useEffect(() => {
    if (phase === 'focus' && remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      stopBackgroundAudio();
      onTimerComplete?.();
    }
  }, [phase, remainingSeconds, isRunning, onTimerComplete, stopBackgroundAudio]);

  // Auto break trigger every 30 minutes of focus for sessions > 30 minutes
  useEffect(() => {
    if (phase !== 'focus' || !isRunning || !nextBreakAt) return;
    const elapsed = totalSeconds - remainingSeconds;
    if (elapsed >= nextBreakAt && remainingSeconds > 0) {
      playAlertChime(); // Alert for break time
      setPhase('break');
      setBreaksTaken((prev) => {
        const count = prev + 1;
        const breakMinutes = Math.min(5, 2 + count);
        setBreakRemainingSeconds(breakMinutes * 60);
        return count;
      });
      stopBackgroundAudio();

      const remainingAfterBreak = remainingSeconds;
      const nextCandidate = elapsed + 1800;
      setNextBreakAt(remainingAfterBreak > 1800 ? nextCandidate : null);
    }
  }, [phase, isRunning, nextBreakAt, totalSeconds, remainingSeconds, stopBackgroundAudio]);

  // Break completion → resume focus
  useEffect(() => {
    if (phase === 'break' && isRunning && breakRemainingSeconds === 0) {
      setPhase('focus');
      setIsRunning(true);
      startBackgroundAudio();
    }
  }, [phase, isRunning, breakRemainingSeconds, startBackgroundAudio]);

  // Five-minute notification
  useEffect(() => {
    if (phase !== 'focus' || !isRunning) return;
    if (remainingSeconds <= 300 && !hasNotifiedFive) {
      playAlertChime();
      setHasNotifiedFive(true);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('mrror', { body: '5 minutes left on this promise.' });
        } else if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    }
  }, [phase, isRunning, remainingSeconds, hasNotifiedFive]);

  const toggleTimer = useCallback(() => {
    if (!isRunning) {
      playNotificationChime();
      if (phase === 'focus') {
        startBackgroundAudio();
      } else {
        stopBackgroundAudio();
      }
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else {
      stopBackgroundAudio();
    }
    setIsRunning((prev) => !prev);
  }, [isRunning, phase, startBackgroundAudio, stopBackgroundAudio]);

  const handlePresetClick = useCallback((minutes: number) => {
    if (isRunning) return;
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setPhase('focus');
    setBreaksTaken(0);
    setBreakRemainingSeconds(0);
    setNextBreakAt(seconds > 1800 ? 1800 : null);
    setHasNotifiedFive(seconds <= 300);
    setCustomMinutes('');
    stopBackgroundAudio();
  }, [isRunning, stopBackgroundAudio]);

  const handleCustomMinutes = useCallback(() => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins <= 480) {
      const seconds = mins * 60;
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setPhase('focus');
      setBreaksTaken(0);
      setBreakRemainingSeconds(0);
      setNextBreakAt(seconds > 1800 ? 1800 : null);
      setHasNotifiedFive(seconds <= 300);
      setCustomMinutes('');
      stopBackgroundAudio();
    }
  }, [customMinutes, stopBackgroundAudio]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setPhase('focus');
    setRemainingSeconds(totalSeconds);
    setBreakRemainingSeconds(0);
    setBreaksTaken(0);
    setNextBreakAt(totalSeconds > 1800 ? 1800 : null);
    setHasNotifiedFive(totalSeconds <= 300);
    stopBackgroundAudio();
  }, [totalSeconds, stopBackgroundAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundAudio();
      closeAudioContext();
    };
  }, [stopBackgroundAudio]);

  // No direct completion from timer; completion happens via Mark Done on promise card

  const content = (
    <div className="space-y-2">
        {/* Timer display - more compact */}
        <div className="flex items-center justify-center py-2">
          <div className={`text-3xl font-mono font-bold tabular-nums tracking-tight ${phase === 'break' ? 'text-emerald-300' : 'text-white'}`}>
            {phase === 'break' ? breakLabel : timeLabel}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${phase === 'break' ? 'bg-emerald-500' : 'bg-blue-500'}`}
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
            {isRunning ? 'Pause' : phase === 'break' ? 'Resume break' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded text-sm border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition font-medium"
          >
            Reset
          </button>
        </div>

        {/* Duration controls hidden behind a toggle to reduce clutter */}
        <div className="pt-1">
          <button
            onClick={() => setShowDurationPanel(v => !v)}
            className="mx-auto block text-xs text-neutral-400 hover:text-neutral-200 underline"
          >
            {showDurationPanel ? 'Hide duration' : 'Set duration'}
          </button>
          {showDurationPanel && (
            <div className="space-y-2 mt-2 border-t border-neutral-800 pt-2">
              <div className="flex flex-wrap gap-1.5 justify-center">
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
              <div className="flex gap-1.5 justify-center">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Custom"
                  min="1"
                  max="480"
                  disabled={isRunning}
                  className="w-24 px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition disabled:opacity-50"
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
          )}
        </div>
        {phase === 'break' && (
          <div className="mt-3 p-3 rounded-lg border border-emerald-800 bg-emerald-900/20 text-sm text-emerald-100">
            Break {breaksTaken}: take a breath. Resuming focus when the countdown ends.
          </div>
        )}
        </div>
      );

  if (embedded) {
    return (
      <div className="mt-3 pt-3 border-t border-neutral-800">{content}</div>
    );
  }

  return (
    <DashboardCard>
      {content}
    </DashboardCard>
  );
}
