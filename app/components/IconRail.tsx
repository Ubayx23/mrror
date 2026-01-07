'use client';
import { useRouter } from 'next/navigation';

type IconRailPage = 'home' | 'calendar' | 'journal' | 'goals' | 'projects';

interface IconRailProps {
  currentPage: IconRailPage;
  onNavigate?: (page: IconRailPage) => void;
}

/**
 * Phase 4: Vertical left icon rail
 * Icons only, minimal, always visible
 */
export default function IconRail({ currentPage, onNavigate }: IconRailProps) {
  const router = useRouter();
  const icons = [
    { key: 'home' as IconRailPage, label: 'Home', icon: '◆' },
    { key: 'calendar' as IconRailPage, label: 'Calendar', icon: '📅' },
    { key: 'journal' as IconRailPage, label: 'Journal', icon: '◈' },
    { key: 'goals' as IconRailPage, label: 'Goals', icon: '◇' },
    { key: 'projects' as IconRailPage, label: 'Projects', icon: '◉' },
  ];

  const handleClick = (key: IconRailPage) => {
    if (key === 'home') {
      if (onNavigate) {
        onNavigate(key);
      } else {
        router.push('/');
      }
      return;
    }
    if (key === 'calendar') {
      router.push('/calendar');
      return;
    }
    if (key === 'journal') {
      router.push('/journal');
      return;
    }
    if (key === 'goals') {
      router.push('/goals');
      return;
    }
    alert('Coming soon');
  };

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-16 bg-neutral-900 border-r border-neutral-800 z-40">
      <nav className="flex flex-col items-center gap-2 py-6">
        {icons.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            title={item.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition group relative ${
              currentPage === item.key
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            
            {/* Tooltip on hover */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded bg-neutral-800 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
