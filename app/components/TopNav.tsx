'use client';

/**
 * Top navigation bar with links to Home, Tasks, Journal, Goals, Projects.
 * Only Home is functional; others are placeholders.
 */

interface TopNavProps {
  currentPage: 'home' | 'tasks' | 'journal' | 'goals' | 'projects';
  minutestoday: number;
  onTasksClick?: () => void;
}

export default function TopNav({ currentPage, minutestoday, onTasksClick }: TopNavProps) {
  const links: Array<{ key: 'home' | 'tasks' | 'journal' | 'goals' | 'projects'; label: string }> = [
    { key: 'home', label: 'Home' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'journal', label: 'Journal' },
    { key: 'goals', label: 'Goals' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="text-lg font-semibold tracking-tight">mrror</div>

          <nav className="hidden sm:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.key}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (link.key === 'tasks' && onTasksClick) {
                    onTasksClick();
                  } else if (link.key !== 'home') {
                    alert('Coming soon');
                  }
                }}
                className={`text-sm font-medium transition ${
                  currentPage === link.key
                    ? 'text-neutral-900 border-b-2 border-neutral-900 pb-1'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-right">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Focused</div>
            <div className="text-lg font-semibold text-neutral-900">{minutestoday}m</div>
          </div>
        </div>
      </div>
    </header>
  );
}
