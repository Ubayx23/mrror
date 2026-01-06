'use client';

import { useState, useCallback } from 'react';
import { completePromise, failPromise, DailyPromise } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';

interface PromiseResolveCardProps {
  promise: DailyPromise;
  onResolved?: (promise: DailyPromise) => void;
}

/**
 * Phase 5: Promise Resolve Card
 * After timer completes or is stopped, user must resolve the promise
 * Complete or Fail with required reason on failure
 */
export default function PromiseResolveCard({ promise, onResolved }: PromiseResolveCardProps) {
  const [failureReason, setFailureReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const updated = completePromise();
      if (updated) {
        setFailureReason('');
        setError('');
        onResolved?.(updated);
      } else {
        setError('Failed to complete promise');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onResolved]);

  const handleFail = useCallback(async () => {
    if (!failureReason.trim()) {
      setError('Please provide a reason for breaking your promise');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = failPromise(failureReason.trim());
      if (updated) {
        setFailureReason('');
        setError('');
        onResolved?.(updated);
      } else {
        setError('Failed to record promise failure');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [failureReason, onResolved]);

  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Deliver Your Verdict</h3>
          <p className="text-sm text-neutral-400">Time to judge: did you keep your statement?</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <p className="text-white text-sm">{promise.promise}</p>
        </div>

        <div className="space-y-3">
          {/* Complete Button */}
          <button
            type="button"
            onClick={handleComplete}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed transition border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            I Kept My Statement
          </button>

          {/* Fail Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              What happened? (Required for broken statements)
            </label>
            <input
              type="text"
              value={failureReason}
              onChange={(e) => {
                setFailureReason(e.target.value);
                setError('');
              }}
              placeholder="Be honest about what prevented you..."
              maxLength={100}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition text-sm"
            />
            <button
              type="button"
              onClick={handleFail}
              disabled={isSubmitting || !failureReason.trim()}
              className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed transition border border-red-500"
            >
              Confirm: Statement Broken
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950 border border-red-900 rounded px-3 py-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
