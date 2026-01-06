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

/**
 * ============================================================================
 * DAILY PROMISE SYSTEM (Phase 5)
 * ============================================================================
 * New core concept: One promise per day, designed to rebuild self-trust
 * through completed proof, not intention.
 */

export type PromiseState = 'pending' | 'completed' | 'failed';

export interface DailyPromise {
  date: string;                    // YYYY-MM-DD format
  promise: string;                 // The promise text ("Today I will...")
  estimatedMinutes?: number;       // Optional estimated duration
  state: PromiseState;             // pending, completed, or failed
  failureReason?: string;          // Why the promise failed (1 sentence)
  createdAt: string;               // ISO timestamp
  completedAt?: string;            // ISO timestamp when promise was marked complete/failed
}

const PROMISES_STORAGE_KEY = 'mrror-promises-v1';

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get date for a specific day offset (0 = today, -1 = yesterday, etc)
 */
function getDateForOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

/**
 * Get all stored promises
 */
export function getAllPromises(): DailyPromise[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = window.localStorage.getItem(PROMISES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading promises from localStorage:', error);
    return [];
  }
}

/**
 * Get today's promise (if it exists)
 */
export function getTodayPromise(): DailyPromise | null {
  const today = getTodayDate();
  const promises = getAllPromises();
  return promises.find(p => p.date === today) || null;
}

/**
 * Get a promise for a specific date
 */
export function getPromiseByDate(date: string): DailyPromise | null {
  const promises = getAllPromises();
  return promises.find(p => p.date === date) || null;
}

/**
 * Create a new promise for today
 * If one exists, replace it (allows creating multiple per day)
 * Returns the created promise or null on error
 */
export function createPromise(promiseText: string, estimatedMinutes?: number): DailyPromise | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const today = getTodayDate();
    const newPromise: DailyPromise = {
      date: today,
      promise: promiseText,
      estimatedMinutes,
      state: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const allPromises = getAllPromises();
    // Remove any existing promise for today (allows creating a new one)
    const filtered = allPromises.filter(p => p.date !== today);
    const updated = [newPromise, ...filtered];
    window.localStorage.setItem(PROMISES_STORAGE_KEY, JSON.stringify(updated));
    
    return newPromise;
  } catch (error) {
    console.error('Error creating promise:', error);
    return null;
  }
}

/**
 * Complete today's promise
 */
export function completePromise(): DailyPromise | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const today = getTodayDate();
    const allPromises = getAllPromises();
    const promiseIndex = allPromises.findIndex(p => p.date === today);
    
    if (promiseIndex === -1) return null;
    
    allPromises[promiseIndex].state = 'completed';
    allPromises[promiseIndex].completedAt = new Date().toISOString();
    
    window.localStorage.setItem(PROMISES_STORAGE_KEY, JSON.stringify(allPromises));
    return allPromises[promiseIndex];
  } catch (error) {
    console.error('Error completing promise:', error);
    return null;
  }
}

/**
 * Fail today's promise with a reason
 */
export function failPromise(reason: string): DailyPromise | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const today = getTodayDate();
    const allPromises = getAllPromises();
    const promiseIndex = allPromises.findIndex(p => p.date === today);
    
    if (promiseIndex === -1) return null;
    
    allPromises[promiseIndex].state = 'failed';
    allPromises[promiseIndex].failureReason = reason;
    allPromises[promiseIndex].completedAt = new Date().toISOString();
    
    window.localStorage.setItem(PROMISES_STORAGE_KEY, JSON.stringify(allPromises));
    return allPromises[promiseIndex];
  } catch (error) {
    console.error('Error failing promise:', error);
    return null;
  }
}

/**
 * Get last 7 days of promises (for Proof Ledger)
 */
export function getLastSevenDaysPromises(): DailyPromise[] {
  const promises = getAllPromises();
  const result: DailyPromise[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = getDateForOffset(-i);
    const promise = promises.find(p => p.date === date);
    if (promise) {
      result.push(promise);
    }
  }
  
  return result;
}

/**
 * Auto-fail yesterday's unresolved promise (call on app load)
 */
export function autoFailUnresolvedYesterday(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const yesterday = getDateForOffset(-1);
    const allPromises = getAllPromises();
    const yesterdayIndex = allPromises.findIndex(p => p.date === yesterday);
    
    if (yesterdayIndex !== -1 && allPromises[yesterdayIndex].state === 'pending') {
      allPromises[yesterdayIndex].state = 'failed';
      allPromises[yesterdayIndex].failureReason = 'Unresolved at end of day';
      allPromises[yesterdayIndex].completedAt = new Date().toISOString();
      
      window.localStorage.setItem(PROMISES_STORAGE_KEY, JSON.stringify(allPromises));
    }
  } catch (error) {
    console.error('Error auto-failing yesterday promise:', error);
  }
}
