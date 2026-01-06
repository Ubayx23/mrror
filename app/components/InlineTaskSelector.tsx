'use client';

import { useState, useEffect } from 'react';

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

interface InlineTaskSelectorProps {
  onSelect: (taskId: string, taskName: string, durationMinutes: number) => void;
}

/**
 * Inline task selector - clean list to pick existing task or create new one.
 * Delete tasks inline. No modal, everything on the homepage.
 */
export default function InlineTaskSelector({ onSelect }: InlineTaskSelectorProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [duration, setDuration] = useState(25);
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);

  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
  }, []);

  const handleCreateTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title: newTaskName.trim(),
    };
    
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setSelectedTaskId(newTask.id);
    setNewTaskName('');
    setShowNewTaskInput(false);
  };

  const handleDeleteTask = (taskId: string, taskName: string) => {
    if (!confirm(`Delete "${taskName}"?`)) return;
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
    if (selectedTaskId === taskId) {
      setSelectedTaskId('');
    }
  };

  const handleStart = () => {
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        onSelect(task.id, task.title, duration);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-neutral-700">
            Your tasks
          </label>
          {!showNewTaskInput && (
            <button
              type="button"
              onClick={() => setShowNewTaskInput(true)}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              + New task
            </button>
          )}
        </div>

        {showNewTaskInput && (
          <div className="mb-3 space-y-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTask();
                } else if (e.key === 'Escape') {
                  setShowNewTaskInput(false);
                  setNewTaskName('');
                }
              }}
              placeholder="Task name..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateTask}
                className="px-3 py-1 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewTaskInput(false);
                  setNewTaskName('');
                }}
                className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4 text-center">No tasks yet. Create one above.</p>
        ) : (
          <div className="space-y-1 border border-neutral-200 rounded-lg overflow-hidden">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition ${
                  selectedTaskId === task.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900'
                }`}
              >
                <span className="text-sm font-medium flex-1">{task.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id, task.title);
                  }}
                  className={`text-xs px-2 py-1 rounded transition ${
                    selectedTaskId === task.id
                      ? 'text-white hover:bg-white/20'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Delete
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-2">
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Math.max(1, Math.min(120, parseInt(e.target.value) || 25)))}
          min="1"
          max="120"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
        />
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!selectedTaskId}
        className="w-full px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start focus session
      </button>
    </div>
  );
}
