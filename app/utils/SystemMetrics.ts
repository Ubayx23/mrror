/**
 * SystemMetrics.ts
 * Calculates derived metrics from daily records: streak, integrity, rot index, focus ratio, etc.
 */

import { DailyRecord, getAllRecords, getLastRecordDate } from './storage';

/**
 * Calculate System Integrity percentage
 * Average of (impulseControl, focusConsistency, emotionalStability) × 10
 * Result: 0-100
 */
export function calculateSystemIntegrity(
  impulseControl: number,
  focusConsistency: number,
  emotionalStability: number
): number {
  const average = (impulseControl + focusConsistency + emotionalStability) / 3;
  return Math.round(average * 10);
}

/**
 * Calculate Rot Index percentage
 * (Time Wasted / 16 waking hours) × 100
 * Capped at 100%
 */
export function calculateRotIndex(timeWasted: number): number {
  const wakingHours = 16;
  const rotIndex = (timeWasted / wakingHours) * 100;
  return Math.min(Math.round(rotIndex), 100);
}

/**
 * Calculate Focus Ratio
 * focusConsistency / timeWasted
 * If timeWasted is 0, return focusConsistency as proxy
 */
export function calculateFocusRatio(
  focusConsistency: number,
  timeWasted: number
): number {
  if (timeWasted === 0) return focusConsistency;
  return parseFloat((focusConsistency / timeWasted).toFixed(2));
}

/**
 * Calculate consistency streak
 * Days in a row user submitted a reflection
 * Returns 0 if no records exist or gap detected
 */
export function calculateStreak(): number {
  const records = getAllRecords();
  if (records.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(records[0].timestamp);

  for (let i = 1; i < records.length; i++) {
    const previousDate = new Date(records[i].timestamp);
    const dayDifference = Math.floor(
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Streak continues if exactly 1 day apart
    if (dayDifference === 1) {
      streak++;
      currentDate = previousDate;
    } else {
      // Gap detected, streak breaks
      break;
    }
  }

  return streak;
}

/**
 * Get average integrity over last N days
 */
export function getAverageIntegrity(days: number = 7): number {
  const records = getAllRecords();
  const cutoffTime = new Date();
  cutoffTime.setDate(cutoffTime.getDate() - days);

  const recentRecords = records.filter(record => {
    return new Date(record.timestamp) >= cutoffTime;
  });

  if (recentRecords.length === 0) return 0;

  const sum = recentRecords.reduce((acc, record) => acc + record.systemIntegrity, 0);
  return Math.round(sum / recentRecords.length);
}

/**
 * Get average rot index over last N days
 */
export function getAverageRotIndex(days: number = 7): number {
  const records = getAllRecords();
  const cutoffTime = new Date();
  cutoffTime.setDate(cutoffTime.getDate() - days);

  const recentRecords = records.filter(record => {
    return new Date(record.timestamp) >= cutoffTime;
  });

  if (recentRecords.length === 0) return 0;

  const sum = recentRecords.reduce((acc, record) => acc + record.rotIndex, 0);
  return Math.round(sum / recentRecords.length);
}

/**
 * Determine system status based on integrity
 */
export function getSystemStatus(integrity: number): 'NOMINAL' | 'DEGRADED' {
  return integrity >= 70 ? 'NOMINAL' : 'DEGRADED';
}

/**
 * Get status color (for terminal display)
 */
export function getStatusColor(status: 'NOMINAL' | 'DEGRADED'): string {
  return status === 'NOMINAL' ? 'cyan' : 'red';
}

/**
 * Check if streak is active (consecutive days)
 * Used to determine if user maintained discipline
 */
export function isStreakActive(): boolean {
  const records = getAllRecords();
  if (records.length < 1) return false;

  const lastRecordDate = getLastRecordDate();
  if (!lastRecordDate) return false;

  const today = new Date();
  const daysSinceLastRecord = Math.floor(
    (today.getTime() - lastRecordDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak is active if last record was today or yesterday
  return daysSinceLastRecord <= 1;
}

/**
 * Summary metrics for dashboard
 */
export interface DashboardMetrics {
  streak: number;
  currentIntegrity: number;
  currentStatus: 'NOMINAL' | 'DEGRADED';
  averageIntegrity: number;
  averageRotIndex: number;
  focusRatio: number;
  latestRecord: DailyRecord | null;
}

export function calculateDashboardMetrics(): DashboardMetrics {
  const records = getAllRecords();
  const latestRecord = records.length > 0 ? records[0] : null;

  return {
    streak: calculateStreak(),
    currentIntegrity: latestRecord?.systemIntegrity ?? 0,
    currentStatus: getSystemStatus(latestRecord?.systemIntegrity ?? 0),
    averageIntegrity: getAverageIntegrity(7),
    averageRotIndex: getAverageRotIndex(7),
    focusRatio: latestRecord
      ? calculateFocusRatio(latestRecord.focusConsistency, latestRecord.timeWasted)
      : 0,
    latestRecord,
  };
}
