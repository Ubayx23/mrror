'use client';

import { useState } from 'react';
import { DashboardCard } from './DashboardGrid';

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

interface InlineTaskSelectorV2Props {
  onSelect: (taskId: string, taskName: string, durationMinutes: number) => void;
}

/**
 * Phase 4: Dark mode task selector
 * Clean list view with inline delete, integrated into dashboard
 */
export default function InlineTaskSelectorV2({ onSelect }: InlineTaskSelectorV2Props) {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [duration, setDuration] = useState(25);
  const [customMinutesText, setCustomMinutesText] = useState('25');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);

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
    <DashboardCard fullWidth className="lg:col-span-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Start a focus session</h3>
          {!showNewTaskInput && (
            <button
              onClick={() => setShowNewTaskInput(true)}
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + New task
            </button>
          )}
        </div>

        {showNewTaskInput && (
          <div className="space-y-3 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
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
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateTask}
                className="px-4 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewTaskInput(false);
                  setNewTaskName('');
                }}
                className="px-4 py-1.5 text-sm text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Task list */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-3">
            Select a task
          </label>
          {tasks.length === 0 ? (
            <p className="text-sm text-neutral-500 py-8 text-center">
              No tasks yet. Create one above.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition border ${
                    selectedTaskId === task.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                      : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600 text-neutral-300'
                  }`}
                >
                  <span className="text-sm font-medium">{task.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id, task.title);
                    }}
                    className={`text-xs px-2 py-1 rounded transition ${
                      selectedTaskId === task.id
                        ? 'text-emerald-200 hover:bg-white/10'
                        : 'text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    Delete
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duration + Start */}
        <div className="flex flex-col gap-4 pt-4 border-t border-neutral-800">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-3">
              Session duration (minutes)
            </label>
            <div className="flex gap-2 items-center">
              <div className="grid grid-cols-4 gap-2 flex-1">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`px-3 py-2 rounded-lg font-medium transition border text-sm ${
                      duration === mins
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <span className="text-neutral-600 text-sm">or</span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Math.min(120, parseInt(e.target.value) || 25)))}
                min="1"
                max="120"
                className="w-20 px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleStart}
            disabled={!selectedTaskId}
            className="w-full px-8 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-lg"
          >
            Start focus session
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
