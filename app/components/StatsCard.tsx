'use client';

import { DashboardCard } from './DashboardGrid';

interface StatsCardProps {
  minutesToday: number;
}

/**
 * Phase 4: Stats overview card
 * Shows daily focus minutes and placeholder for future metrics
 */
export default function StatsCard({ minutesToday }: StatsCardProps) {
  return (
    <DashboardCard>
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
          Today's Focus
        </h3>
        
        <div>
          <div className="text-4xl font-bold text-emerald-400 mb-1">
            {minutesToday}<span className="text-2xl text-neutral-500">m</span>
          </div>
          <p className="text-xs text-neutral-500">Minutes earned</p>
        </div>

        <div className="pt-4 border-t border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">Sessions</span>
            <span className="text-neutral-300 font-medium">-</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">Avg session</span>
            <span className="text-neutral-300 font-medium">-</span>
          </div>
          <p className="text-xs text-neutral-600 italic mt-3">
            Extended stats coming soon
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
