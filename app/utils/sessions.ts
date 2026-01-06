'use client';

/**
 * Session tracking for completed focus sessions.
 * Tracks completed sessions (not running ones) and can calculate daily progress.
 */

export interface FocusSession {
  id: string;
  taskId: string;
  taskName: string;
  durationSeconds: number;
  completedAt: string; // ISO timestamp
}

const SESSION_STORAGE_KEY = 'mrror-sessions-v1';

export function loadSessions(): FocusSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FocusSession[]) : [];
  } catch (err) {
    console.error('Error loading sessions', err);
    return [];
  }
}

export function saveSessions(sessions: FocusSession[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions', err);
  }
}

export function addSession(taskId: string, taskName: string, durationSeconds: number) {
  const sessions = loadSessions();
  const newSession: FocusSession = {
    id: crypto.randomUUID(),
    taskId,
    taskName,
    durationSeconds,
    completedAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
}

/**
 * Get total minutes focused today (sum of completed sessions).
 * Resets at local midnight.
 */
export function getMinutesCurrentDay(): number {
  const sessions = loadSessions();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const sessionsToday = sessions.filter((s) => {
    const completedDate = new Date(s.completedAt);
    const sessionDay = new Date(
      completedDate.getFullYear(),
      completedDate.getMonth(),
      completedDate.getDate()
    );
    return sessionDay.getTime() === today.getTime();
  });

  const totalSeconds = sessionsToday.reduce((sum, s) => sum + s.durationSeconds, 0);
  return Math.floor(totalSeconds / 60);
}

/**
 * Get count of completed sessions today
 */
export function getSessionsCountToday(): number {
  const sessions = loadSessions();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return sessions.filter((s) => {
    const completedDate = new Date(s.completedAt);
    const sessionDay = new Date(
      completedDate.getFullYear(),
      completedDate.getMonth(),
      completedDate.getDate()
    );
    return sessionDay.getTime() === today.getTime();
  }).length;
}

/**
 * Get count of unique tasks completed today
 */
export function getTasksCompletedToday(): number {
  const sessions = loadSessions();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const uniqueTaskIds = new Set(
    sessions
      .filter((s) => {
        const completedDate = new Date(s.completedAt);
        const sessionDay = new Date(
          completedDate.getFullYear(),
          completedDate.getMonth(),
          completedDate.getDate()
        );
        return sessionDay.getTime() === today.getTime();
      })
      .map((s) => s.taskId)
  );

  return uniqueTaskIds.size;
}
