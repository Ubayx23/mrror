'use client';

import { useState } from 'react';

interface TaskItem {
  id: string;
  title: string;
}

const TASK_STORAGE_KEY = 'mrror-tasks-v1';

function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TaskItem[]) : [];
  } catch (err) {
    console.error('Error loading tasks', err);
    return [];
  }
}

function saveTasks(tasks: TaskItem[]) {
  try {
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks', err);
  }
}

interface AllTasksListProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal showing all tasks (not on active execution surface).
 * Can edit or delete tasks.
 */
export default function AllTasksList({ isOpen, onClose }: AllTasksListProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());

  const deleteTask = (taskId: string, taskName: string) => {
    if (!confirm(`Delete "${taskName}"?`)) return;
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">All tasks</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-neutral-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-neutral-50">
                <span className="text-sm text-neutral-900 flex-1">{task.title}</span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id, task.title)}
                  className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
