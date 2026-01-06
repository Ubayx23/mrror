'use client';

import FocusTimer from '@/app/components/FocusTimer';
import TasksPanel from '@/app/components/TasksPanel';

// Phase 2 home workspace: focus timer, tasks, and placeholders for upcoming tools.
export default function DashboardShell() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">mrror</div>
          <div className="text-sm text-neutral-500">Home</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-2xl">
            You built this to remove noise and start faster. Keep it light: one timer, a short task list, and room to grow when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <FocusTimer />
            <TasksPanel />
          </div>

          <aside className="space-y-4">
            <PlaceholderCard title="Notes" description="Capture quick thoughts." />
            <PlaceholderCard title="Journal" description="Reflect without friction." />
            <PlaceholderCard title="Goals" description="Keep direction visible." />
            <PlaceholderCard title="Learning" description="Track what you're practicing." />
          </aside>
        </div>
      </main>
    </div>
  );
}

interface PlaceholderProps {
  title: string;
  description: string;
}

function PlaceholderCard({ title, description }: PlaceholderProps) {
  return (
    <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-2">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-neutral-500">{description}</p>
      <p className="text-sm text-neutral-400">Coming soon.</p>
    </section>
  );
}
