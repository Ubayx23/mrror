'use client';

/**
 * Per-day calendar tasks storage
 * Each day can have its own set of tasks/intentions independent from the main Intent+Tasks
 */

export interface DayTask {
  id: string;
  date: string;        // YYYY-MM-DD
  title: string;
  completed: boolean;
  completedAt?: string; // ISO timestamp when marked complete
  createdAt: string;   // ISO timestamp
}

const CALENDAR_TASKS_KEY = 'mrror-calendar-tasks-v1';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getAllDayTasks(): DayTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CALENDAR_TASKS_KEY);
    return raw ? (JSON.parse(raw) as DayTask[]) : [];
  } catch {
    return [];
  }
}

function saveDayTasks(tasks: DayTask[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(tasks));
  } catch {}
}

/**
 * Get all tasks for a specific date (YYYY-MM-DD)
 */
export function getTasksForDate(date: string): DayTask[] {
  const all = getAllDayTasks();
  return all.filter(t => t.date === date).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Add a task for a specific date
 */
export function addTaskForDate(date: string, title: string): DayTask | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const all = getAllDayTasks();
    const newTask: DayTask = {
      id: crypto.randomUUID(),
      date,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveDayTasks([...all, newTask]);
    return newTask;
  } catch {
    return null;
  }
}

/**
 * Toggle task completion status
 */
export function toggleTaskCompletion(taskId: string): DayTask | null {
  try {
    const all = getAllDayTasks();
    const task = all.find(t => t.id === taskId);
    if (!task) return null;
    
    task.completed = !task.completed;
    if (task.completed) {
      task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = undefined;
    }
    saveDayTasks(all);
    return task;
  } catch {
    return null;
  }
}

/**
 * Delete a task
 */
export function deleteTask(taskId: string): boolean {
  try {
    const all = getAllDayTasks();
    const filtered = all.filter(t => t.id !== taskId);
    saveDayTasks(filtered);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a date has any tasks
 */
export function hasTasksForDate(date: string): boolean {
  return getTasksForDate(date).length > 0;
}

/**
 * Count completed tasks for a date
 */
export function getCompletedCountForDate(date: string): number {
  return getTasksForDate(date).filter(t => t.completed).length;
}
