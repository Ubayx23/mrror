'use client';

import { useEffect, useState, FormEvent } from 'react';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'mrror-tasks-v1';

function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TaskItem[]) : [];
  } catch (err) {
    console.error('Error loading tasks', err);
    return [];
  }
}

function saveTasks(tasks: TaskItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks', err);
  }
}

// Basic task list: add, complete, delete. Flat list only.
export default function TasksPanel() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    saveTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    const title = draft.trim();
    if (!title) return;
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setDraft('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTask();
  };

  return (
    <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Tasks</h2>
        <p className="text-sm text-neutral-500">Flat list. Add, complete, or delete. Stored locally.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
        >
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-sm text-neutral-400">Nothing here yet. Add your first task.</p>
      ) : (
        <ul className="space-y-2" aria-label="Task list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-3 py-2"
            >
              <label className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <span
                  className={`text-sm ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}
                >
                  {task.title}
                </span>
              </label>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-sm text-neutral-400 hover:text-neutral-700"
                aria-label="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
