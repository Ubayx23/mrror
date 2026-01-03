'use client';

import { useState } from 'react';
import { DailyRecord } from '@/app/utils/storage';
import {
  calculateDashboardMetrics,
  DashboardMetrics,
} from '@/app/utils/SystemMetrics';

interface DashboardProps {
  latestRecord: DailyRecord;
}

export default function Dashboard({ latestRecord }: DashboardProps) {
  const [metrics] = useState<DashboardMetrics | null>(() => 
    calculateDashboardMetrics()
  );

  if (!metrics) return null;

  const statusColor = metrics.currentStatus === 'NOMINAL' ? 'text-cyan-400' : 'text-red-500';
  const statusBg = metrics.currentStatus === 'NOMINAL' ? 'bg-cyan-400/5' : 'bg-red-500/5';

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-cyan-400/30 pb-4">
          <div className="text-xs sm:text-sm opacity-75">&raquo; SYSTEM DASHBOARD</div>
          <div className={`text-lg sm:text-2xl font-bold ${statusColor}`}>
            SYSTEM INTEGRITY: {metrics.currentStatus} [{metrics.currentIntegrity}%]
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Streak */}
          <div className={`border border-cyan-400/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs opacity-75">&raquo; CONSISTENCY STREAK</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.streak}</div>
            <div className="text-xs opacity-50">days in a row</div>
          </div>

          {/* Rot Index */}
          <div className={`border border-cyan-400/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs opacity-75">&raquo; ROT INDEX</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.averageRotIndex}%</div>
            <div className="text-xs opacity-50">7-day average</div>
          </div>

          {/* Focus Ratio */}
          <div className={`border border-cyan-400/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs opacity-75">&raquo; FOCUS RATIO</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.focusRatio}</div>
            <div className="text-xs opacity-50">consistency / time wasted</div>
          </div>

          {/* 7-Day Average Integrity */}
          <div className={`border border-cyan-400/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs opacity-75">&raquo; 7-DAY AVERAGE INTEGRITY</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.averageIntegrity}%</div>
            <div className="text-xs opacity-50">trend analysis</div>
          </div>
        </div>

        {/* Today's Metrics Breakdown */}
        <div className="border border-cyan-400/30 p-4 space-y-4">
          <div className="text-xs sm:text-sm opacity-75 border-b border-cyan-400/30 pb-3">
            &raquo; TODAY&apos;S DIAGNOSTIC BREAKDOWN
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs opacity-50">IMPULSE CONTROL</div>
              <div className="text-lg font-bold">{latestRecord.impulseControl}/10</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs opacity-50">FOCUS CONSISTENCY</div>
              <div className="text-lg font-bold">{latestRecord.focusConsistency}/10</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs opacity-50">EMOTIONAL STABILITY</div>
              <div className="text-lg font-bold">{latestRecord.emotionalStability}/10</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs opacity-50">TIME WASTED</div>
              <div className="text-lg font-bold">{latestRecord.timeWasted}h</div>
            </div>
          </div>
        </div>

        {/* Mission Debrief */}
        {latestRecord.missionDebrief && (
          <div className="border border-cyan-400/30 p-4 space-y-3">
            <div className="text-xs sm:text-sm opacity-75 border-b border-cyan-400/30 pb-2">
              &raquo; LATEST MISSION DEBRIEF
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {latestRecord.missionDebrief}
            </p>
          </div>
        )}

        {/* Tomorrow's Directive */}
        {latestRecord.tomorrowObjective && (
          <div className="border border-cyan-400/30 p-4 space-y-3">
            <div className="text-xs sm:text-sm opacity-75 border-b border-cyan-400/30 pb-2">
              &raquo; TOMORROW&apos;S PRIME OBJECTIVE
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{latestRecord.tomorrowObjective}</p>
              <p className="text-xs opacity-50">
                EXECUTION WINDOW: {latestRecord.executionWindow}
              </p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs opacity-50 text-center border-t border-cyan-400/30 pt-4">
          Logged: {new Date(latestRecord.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
