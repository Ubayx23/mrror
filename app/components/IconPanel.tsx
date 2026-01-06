'use client';

/**
 * Icon panel for secondary tools.
 * Shows icons for Tasks, Notes, Journal, Goals, Learning.
 * Placeholders for now.
 */

interface IconPanelProps {
  onTasksClick: () => void;
  minutestoday: number;
}

export default function IconPanel({ onTasksClick, minutestoday }: IconPanelProps) {
  return (
    <aside className="border-l border-neutral-200 bg-neutral-50 px-4 py-6 space-y-4">
      <div className="space-y-1 pb-4 border-b border-neutral-200">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Today</p>
        <p className="text-2xl font-semibold text-neutral-900">{minutestoday}m</p>
        <p className="text-xs text-neutral-500">focused</p>
      </div>

      <nav className="space-y-2">
        <button
          type="button"
          onClick={onTasksClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition"
          title="View all tasks"
        >
          <span className="text-lg">📋</span>
          <span>Tasks</span>
        </button>

        <button
          type="button"
          disabled
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <span className="text-lg">📝</span>
          <span>Notes</span>
        </button>

        <button
          type="button"
          disabled
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <span className="text-lg">📖</span>
          <span>Journal</span>
        </button>

        <button
          type="button"
          disabled
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <span className="text-lg">🎯</span>
          <span>Goals</span>
        </button>

        <button
          type="button"
          disabled
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <span className="text-lg">📚</span>
          <span>Learning</span>
        </button>
      </nav>
    </aside>
  );
}
