'use client';

import { DashboardCard } from './DashboardGrid';

interface StatsCardProps {
  minutesToday: number;
  sessionsToday: number;
  tasksCompleted: number;
}

/**
 * Today's summary stats
 * Shows minutes, sessions, and tasks completed
 */
export default function StatsCard({ minutesToday, sessionsToday, tasksCompleted }: StatsCardProps) {
  return (
    <DashboardCard>
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
          Today's Summary
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-1">
              {minutesToday}<span className="text-2xl text-neutral-500">m</span>
            </div>
            <p className="text-xs text-neutral-500">Minutes focused</p>
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Sessions</span>
              <span className="text-2xl font-semibold text-neutral-300">{sessionsToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Tasks completed</span>
              <span className="text-2xl font-semibold text-neutral-300">{tasksCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
