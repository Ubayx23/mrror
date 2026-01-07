'use client';

import { useState, FormEvent, useEffect } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid, { DashboardCard } from '@/app/components/DashboardGrid';
import { getTasksForDate, addTaskForDate, toggleTaskCompletion, deleteTask } from '@/app/utils/calendar';
import { DayTask } from '@/app/utils/calendar';

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [tasks, setTasks] = useState<DayTask[]>([]);
  const [taskDraft, setTaskDraft] = useState('');

  useEffect(() => {
    setTasks(getTasksForDate(selectedDate));
  }, [selectedDate]);

  const handleDayClick = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    setSelectedDate(getDateString(d));
  };

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    const title = taskDraft.trim();
    if (!title) return;
    const added = addTaskForDate(selectedDate, title);
    if (added) {
      setTasks([...tasks, added]);
      setTaskDraft('');
    }
  };

  const toggleTask = (id: string) => {
    toggleTaskCompletion(id);
    setTasks(getTasksForDate(selectedDate));
  };

  const removeTask = (id: string) => {
    deleteTask(id);
    setTasks(getTasksForDate(selectedDate));
  };

  const isToday = selectedDate === getTodayDate();

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar minutesToday={0} />
      <IconRail currentPage="calendar" />

      <DashboardGrid>
        {/* Weekly Calendar - Left */}
        <div className="lg:col-span-1">
          <DashboardCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-400">This Week</h3>
              </div>
              <WeeklyCalendarClickable selectedDate={selectedDate} onDateSelect={handleDayClick} />
            </div>
          </DashboardCard>
        </div>

        {/* Day Detail - Right */}
        <div className="lg:col-span-1">
          <DashboardCard>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">{formatDateDisplay(selectedDate)} {isToday && <span className="ml-2 text-xs text-emerald-400">(Today)</span>}</p>
              </div>

              {/* Add Task Form */}
              <form onSubmit={addTask} className="flex gap-2">
                <input
                  type="text"
                  value={taskDraft}
                  onChange={(e) => setTaskDraft(e.target.value)}
                  placeholder="Add a task for this day..."
                  className="flex-1 rounded-lg bg-neutral-900 ring-1 ring-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-neutral-500"
                />
                <button type="submit" className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-900 text-sm font-medium hover:bg-white transition">Add</button>
              </form>

              {/* Task List */}
              {tasks.length === 0 ? (
                <p className="text-sm text-neutral-500">No tasks planned for this day.</p>
              ) : (
                <ul className="space-y-2" aria-label="Day tasks">
                  {tasks.map((task) => (
                    <li key={task.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900 px-3 py-2 hover:bg-neutral-850">
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
                        onClick={() => removeTask(task.id)}
                        className="text-sm text-neutral-400 hover:text-red-400"
                        aria-label="Delete task"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DashboardCard>
        </div>
      </DashboardGrid>
    </div>
  );
}

/**
 * Enhanced weekly calendar component with day selection
 */
function WeeklyCalendarClickable({ selectedDate, onDateSelect }: { selectedDate: string; onDateSelect: (offset: number) => void }) {
  const today = new Date();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get the Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, i) => {
        const dateStr = getDateString(d);
        const isSelected = dateStr === selectedDate;
        const isToday = dateStr === getTodayDate();
        const dayTasks = getTasksForDate(dateStr);
        const hasTasks = dayTasks.length > 0;

        return (
          <button
            key={i}
            onClick={() => onDateSelect(i - (today.getDay() === 0 ? 6 : today.getDay() - 1))}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition bg-neutral-900 text-neutral-300 ring-1 ring-neutral-800 hover:bg-neutral-800 ${
              isSelected
                ? 'ring-blue-500 text-white'
                : isToday
                ? 'ring-neutral-600 text-white'
                : hasTasks
                ? dayTasks.every(t => t.completed)
                  ? 'ring-emerald-600 text-emerald-300'
                  : 'ring-red-600 text-red-300'
                : ''
            }`}
            title={formatDateDisplay(dateStr)}
          >
            <div>{daysOfWeek[i]}</div>
            <div>{d.getDate()}</div>
          </button>
        );
      })}
    </div>
  );
}
