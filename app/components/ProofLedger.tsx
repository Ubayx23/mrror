'use client';

import { useMemo } from 'react';
import { getLastSevenDaysSummary } from '@/app/utils/storage';
import { DashboardCard } from './DashboardGrid';

/**
 * Phase 5: Proof Ledger
 * Shows last 7 days of promises with their outcomes
 * Pure proof of what was kept vs broken - no gamification
 */
export default function ProofLedger() {
  const summary = useMemo(() => getLastSevenDaysSummary(), []);

  const kept = summary.reduce((a, d) => a + d.kept, 0);
  const broken = summary.reduce((a, d) => a + d.broken, 0);
  const pending = summary.reduce((a, d) => a + d.pending, 0);

  if (summary.length === 0) {
    return (
      <DashboardCard fullWidth>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Proof Ledger</h3>
          <p className="text-sm text-neutral-400">No promises created yet. Start with today.</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard fullWidth>
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-white">Proof Ledger</h3>
            <p className="text-xs text-neutral-500">Your track record, not your intentions</p>
          </div>
          <div className="text-xs text-neutral-600">Last 7 days</div>
        </div>

        {/* Radial visualization */}
        <div className="flex items-center gap-6">
          <div
            className="w-36 h-36 rounded-full"
            style={{
              background: `conic-gradient(
                #22c55e 0 ${kept + broken + pending === 0 ? 0 : (kept/(kept+broken+pending))*360}deg,
                #ef4444 ${kept + broken + pending === 0 ? 0 : (kept/(kept+broken+pending))*360}deg ${kept + broken + pending === 0 ? 0 : ((kept+broken)/(kept+broken+pending))*360}deg,
                #eab308 ${kept + broken + pending === 0 ? 0 : ((kept+broken)/(kept+broken+pending))*360}deg 360deg
              )`
            }}
          >
            <div className="w-24 h-24 rounded-full bg-neutral-950 border border-neutral-800 mx-auto my-6"></div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-white font-medium">{kept}</span><span className="text-neutral-500">kept</span></div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span><span className="text-white font-medium">{broken}</span><span className="text-neutral-500">broken</span></div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span><span className="text-white font-medium">{pending}</span><span className="text-neutral-500">pending</span></div>
          </div>
        </div>

        {/* Per-day minimal rows */}
        <div className="space-y-1">
          {summary.map(d => (
            <div key={d.date} className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-900 py-1">
              <span>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span><span className="text-emerald-400 font-medium">{d.kept}</span> · <span className="text-red-400 font-medium">{d.broken}</span> · <span className="text-yellow-400 font-medium">{d.pending}</span></span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
