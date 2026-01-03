/**
 * storage.ts
 * Handles all localStorage operations for mrror-records.
 * Stores complete daily records with metrics, reflections, and directives.
 */

export interface DailyRecord {
  timestamp: string;           // ISO timestamp when record was created
  missionSuccess: boolean;     // Did you honor your promise to yourself?
  timeWasted: number;          // hours surrendered to distraction (0-16)
  excuseLog: string;           // What excuse won when discipline slipped?
  impulseControl: number;      // 0-10 self-rating
  focusConsistency: number;    // 0-10 self-rating
  emotionalStability: number;  // 0-10 self-rating
  systemIntegrity: number;     // calculated percentage
  rotIndex: number;            // calculated percentage (time wasted ratio)
  tomorrowObjective: string;   // today's prime objective
  executionWindow: string;     // execution window (Morning/Afternoon/Evening)
}

const STORAGE_KEY = 'mrror-records';

/**
 * Get all stored records from localStorage
 * Returns empty array if storage is empty or on parse error
 */
export function getAllRecords(): DailyRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading mrror-records from localStorage:', error);
    return [];
  }
}

/**
 * Save a new daily record to localStorage
 * Prepends to the array (most recent first)
 */
export function saveRecord(record: DailyRecord): DailyRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const allRecords = getAllRecords();
    const updatedRecords = [record, ...allRecords];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
  } catch (error) {
    console.error('Error saving record to localStorage:', error);
    return [];
  }
}

/**
 * Get the most recent record
 */
export function getLatestRecord(): DailyRecord | null {
  const records = getAllRecords();
  return records.length > 0 ? records[0] : null;
}

/**
 * Get records from the last N days
 */
export function getRecordsByDays(days: number): DailyRecord[] {
  const records = getAllRecords();
  const cutoffTime = new Date();
  cutoffTime.setDate(cutoffTime.getDate() - days);
  
  return records.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= cutoffTime;
  });
}

/**
 * Check if user already submitted a record today
 * Compares the date (not time) of the latest record with today
 */
export function hasRecordToday(): boolean {
  const latest = getLatestRecord();
  if (!latest) return false;
  
  const latestDate = new Date(latest.timestamp);
  const today = new Date();
  
  return (
    latestDate.getFullYear() === today.getFullYear() &&
    latestDate.getMonth() === today.getMonth() &&
    latestDate.getDate() === today.getDate()
  );
}

/**
 * Get the date of the last submitted record
 */
export function getLastRecordDate(): Date | null {
  const latest = getLatestRecord();
  return latest ? new Date(latest.timestamp) : null;
}

/**
 * Clear all records (for testing/reset)
 */
export function clearAllRecords(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
