'use client';

import { useState } from 'react';
import { getLastSevenDaysPromises, DailyPromise } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';

/**
 * Phase 5: Proof Ledger
 * Shows last 7 days of promises with their outcomes
 * Pure proof of what was kept vs broken - no gamification
 */
export default function ProofLedger() {
  const [promises] = useState<DailyPromise[]>(() => getLastSevenDaysPromises());

  if (promises.length === 0) {
    return (
      <DashboardCard fullWidth>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Proof Ledger</h3>
          <p className="text-sm text-neutral-400">No promises created yet. Start with today.</p>
        </div>
      </DashboardCard>
    );
  }

  const kept = promises.filter(p => p.state === 'completed').length;
  const broken = promises.filter(p => p.state === 'failed').length;

  return (
    <DashboardCard fullWidth>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">Proof Ledger</h3>
          <p className="text-xs text-neutral-500">Your track record, not your intentions</p>
        </div>

        {/* Summary counts */}
        <div className="flex gap-4 text-sm border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-base">✓</span>
            <span className="text-white font-medium">{kept}</span>
            <span className="text-neutral-500">kept</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-base">✗</span>
            <span className="text-white font-medium">{broken}</span>
            <span className="text-neutral-500">broken</span>
          </div>
          <div className="ml-auto text-xs text-neutral-600 self-end">Last 7 days</div>
        </div>

        {/* Day-by-day ledger */}
        <div className="space-y-2">
          {promises.map((promise) => {
            const dateObj = new Date(promise.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={promise.date} className="flex items-start gap-3 bg-neutral-900/50 rounded-lg p-3 border border-neutral-800/50 hover:bg-neutral-900 hover:border-neutral-800 transition">
                <div className="text-base flex-shrink-0">
                  {promise.state === 'completed' ? '✓' : promise.state === 'pending' ? '◌' : '✗'}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-500">{dayStr} {dateStr}</span>
                    <span className={`text-xs font-medium capitalize ${
                      promise.state === 'completed' ? 'text-green-400' :
                      promise.state === 'failed' ? 'text-red-400' :
                      'text-yellow-500'
                    }`}>{promise.state}</span>
                  </div>
                  <p className="text-sm text-white mt-1 break-words">{promise.promise}</p>
                  {promise.failureReason && (
                    <p className="text-xs text-neutral-500 mt-1 italic">&quot;{promise.failureReason}&quot;</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}
