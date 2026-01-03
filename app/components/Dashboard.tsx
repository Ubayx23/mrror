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

  const statusColor = metrics.currentStatus === 'NOMINAL' ? 'text-terminal-cyan' : 'text-terminal-red';
  const statusBg = metrics.currentStatus === 'NOMINAL' ? 'bg-terminal-cyan/5' : 'bg-terminal-red/5';
  const missionStatusColor = latestRecord.missionSuccess ? 'text-terminal-cyan' : 'text-terminal-red';
  const missionStatusBg = latestRecord.missionSuccess ? 'bg-terminal-cyan/10' : 'bg-terminal-red/10';

  return (
    <div className="min-h-screen bg-true-black text-terminal-cyan font-mono px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-terminal-cyan/30 pb-4">
          <div className="text-xs sm:text-sm text-subtext-gray">&raquo; SYSTEM DASHBOARD</div>
          <div className={`text-lg sm:text-2xl font-bold ${statusColor}`}>
            SYSTEM INTEGRITY: {metrics.currentStatus} [{metrics.currentIntegrity}%]
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mission Success */}
          <div className={`border border-terminal-cyan/30 ${missionStatusBg} p-4 space-y-2`}>
            <div className="text-xs text-subtext-gray">&raquo; MISSION HONOR</div>
            <div className={`text-3xl sm:text-4xl font-bold ${missionStatusColor}`}>
              {latestRecord.missionSuccess ? 'YES' : 'NO'}
            </div>
            <div className="text-xs text-subtext-gray">
              {latestRecord.missionSuccess ? 'Integrity maintained' : 'Breach detected'}
            </div>
          </div>

          {/* Streak */}
          <div className={`border border-terminal-cyan/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs text-subtext-gray">&raquo; CONSISTENCY STREAK</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.streak}</div>
            <div className="text-xs text-subtext-gray">days in a row</div>
          </div>

          {/* Time Wasted */}
          <div className={`border border-terminal-cyan/30 ${latestRecord.timeWasted > 3 ? 'bg-terminal-red/10' : statusBg} p-4 space-y-2`}>
            <div className="text-xs text-subtext-gray">&raquo; TIME WASTED</div>
            <div className={`text-2xl sm:text-3xl font-bold ${latestRecord.timeWasted > 3 ? 'text-terminal-red' : ''}`}>
              {latestRecord.timeWasted}h
            </div>
            <div className="text-xs text-subtext-gray">
              {latestRecord.timeWasted > 3 ? 'Excessive distraction' : 'yesterday'}
            </div>
          </div>

          {/* Rot Index */}
          <div className={`border border-terminal-cyan/30 ${statusBg} p-4 space-y-2`}>
            <div className="text-xs text-subtext-gray">&raquo; ROT INDEX</div>
            <div className="text-2xl sm:text-3xl font-bold">{metrics.averageRotIndex}%</div>
            <div className="text-xs text-subtext-gray">7-day average</div>
          </div>
        </div>

        {/* Today's Metrics Breakdown */}
        <div className="border border-terminal-cyan/30 bg-steel-gray/20 p-4 space-y-4">
          <div className="text-xs sm:text-sm text-subtext-gray border-b border-terminal-cyan/30 pb-3">
            &raquo; FOCUS & CONTROL DIAGNOSTICS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-subtext-gray">IMPULSE CONTROL</div>
              <div className="text-lg font-bold">{latestRecord.impulseControl}/10</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-subtext-gray">FOCUS CONSISTENCY</div>
              <div className="text-lg font-bold">{latestRecord.focusConsistency}/10</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-subtext-gray">EMOTIONAL STABILITY</div>
              <div className="text-lg font-bold">{latestRecord.emotionalStability}/10</div>
            </div>
          </div>
        </div>

        {/* Excuse Log */}
        {latestRecord.excuseLog && (
          <div className="border border-terminal-cyan/30 bg-steel-gray/20 p-4 space-y-3">
            <div className="text-xs sm:text-sm text-subtext-gray border-b border-terminal-cyan/30 pb-2">
              &raquo; EXCUSE LOG
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {latestRecord.excuseLog}
            </p>
          </div>
        )}

        {/* Tomorrow's Directive */}
        {latestRecord.tomorrowObjective && (
          <div className="border border-terminal-cyan/30 bg-steel-gray/20 p-4 space-y-3">
            <div className="text-xs sm:text-sm text-subtext-gray border-b border-terminal-cyan/30 pb-2">
              &raquo; TODAY&apos;S PRIME OBJECTIVE
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{latestRecord.tomorrowObjective}</p>
              <p className="text-xs text-subtext-gray">
                EXECUTION WINDOW: {latestRecord.executionWindow}
              </p>
            </div>
          </div>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="border border-terminal-cyan/30 bg-steel-gray/20 p-3 space-y-1">
            <div className="text-subtext-gray">7-DAY AVG INTEGRITY</div>
            <div className="text-xl font-bold">{metrics.averageIntegrity}%</div>
          </div>
          <div className="border border-terminal-cyan/30 bg-steel-gray/20 p-3 space-y-1">
            <div className="text-subtext-gray">FOCUS RATIO</div>
            <div className="text-xl font-bold">{metrics.focusRatio}</div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-subtext-gray text-center border-t border-terminal-cyan/30 pt-4">
          Logged: {new Date(latestRecord.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
