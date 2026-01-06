'use client';

import { useEffect, useState, FormEvent } from 'react';

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

interface TaskSelectorProps {
  onSelect: (taskId: string, taskName: string, durationMinutes: number) => void;
  isOpen: boolean;
}

/**
 * Modal to select an existing task or create a new one,
 * then set the focus duration before binding to the timer.
 */
export default function TaskSelector({ onSelect, isOpen }: TaskSelectorProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'create'>('list');

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setNewTaskTitle('');
    setSelectedTaskId(newTask.id);
    setMode('list');
  };

  const handleSelectAndStart = (taskId: string, taskName: string) => {
    onSelect(taskId, taskName, durationMinutes);
    setSelectedTaskId(null);
    setMode('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold tracking-tight mb-4">
          {mode === 'list' ? 'Select a task' : 'New task'}
        </h2>

        {mode === 'list' ? (
          <>
            {tasks.length === 0 ? (
              <p className="text-sm text-neutral-500 mb-4">No tasks yet. Create one to get started.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTaskId(task.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                        selectedTaskId === task.id
                          ? 'border-neutral-900 bg-neutral-100'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {task.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <label className="block text-sm font-medium mb-2">Focus duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 25)}
                className="w-full px-2 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('create')}
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-100 transition"
              >
                New task
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedTaskId) {
                    const task = tasks.find((t) => t.id === selectedTaskId);
                    if (task) {
                      handleSelectAndStart(selectedTaskId, task.title);
                    }
                  }
                }}
                disabled={!selectedTaskId}
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition"
              >
                Start
              </button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task name..."
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-100 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
