'use client';

import { useEffect, useState, FormEvent } from 'react';
import { DashboardCard } from './DashboardGrid';
import { loadCurrentIntent, saveIntent } from '@/app/utils/intent';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const TASKS_KEY = 'mrror-tasks-v2';

function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw) as TaskItem[];
    // migrate from v1 if present
    const legacy = window.localStorage.getItem('mrror-tasks-v1');
    if (!legacy) return [];
    const parsed = JSON.parse(legacy) as TaskItem[];
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return [];
  }
}

function saveTasks(tasks: TaskItem[]) {
  try {
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {}
}

export default function IntentTasksPanel() {
  // Intent
  const [intentDraft, setIntentDraft] = useState('');
  const [currentIntent, setCurrentIntent] = useState<string | null>(() => {
    const loaded = loadCurrentIntent();
    return loaded ? loaded.text : null;
  });
  const [editingIntent, setEditingIntent] = useState(() => {
    const loaded = loadCurrentIntent();
    return !loaded;
  });

  const submitIntent = (e: FormEvent) => {
    e.preventDefault();
    const t = intentDraft.trim();
    if (!t) return;
    saveIntent(t);
    setCurrentIntent(t);
    setIntentDraft('');
    setEditingIntent(false);
  };

  const editIntent = () => {
    setIntentDraft(currentIntent || '');
    setEditingIntent(true);
  };

  // Tasks
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [taskDraft, setTaskDraft] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    saveTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    const title = taskDraft.trim();
    if (!title) return;
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setTaskDraft('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const submitTask = (e: FormEvent) => {
    e.preventDefault();
    addTask();
  };

  return (
    <DashboardCard fullWidth>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Intent + Tasks</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Intent */}
          <div className="space-y-3">
            {editingIntent ? (
              <form onSubmit={submitIntent} className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">Your intent</label>
                <input
                  type="text"
                  value={intentDraft}
                  onChange={(e) => setIntentDraft(e.target.value)}
                  placeholder="What are you working on, and why does it matter?"
                  maxLength={120}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
                <button type="submit" className="px-3 py-2 bg-neutral-100 text-neutral-900 rounded text-sm font-medium hover:bg-white transition">
                  Set intent
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Your intent</p>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
                  <p className="text-sm text-neutral-200">{currentIntent}</p>
                </div>
                <button type="button" onClick={editIntent} className="text-xs text-neutral-500 hover:text-neutral-300 underline">
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Right: Tasks */}
          <div className="space-y-2">
            <form onSubmit={submitTask} className="flex gap-2">
              <input
                type="text"
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
              <button type="submit" className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-white transition">
                Add
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="text-sm text-neutral-500">Nothing here yet. Add your first task.</p>
            ) : (
              <ul className="space-y-2" aria-label="Task list">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 px-3 py-2">
                    <label className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className={`text-sm ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>{task.title}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="text-sm text-neutral-500 hover:text-red-400"
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
