'use client';

interface TopBarProps {
  activeTaskName?: string;
  timerDisplay?: string;
  isTimerRunning?: boolean;
  minutesToday: number;
}

/**
 * Phase 4: Top system bar
 * Always visible, shows app name, active timer status, and session info
 */
export default function TopBar({ 
  activeTaskName, 
  timerDisplay, 
  isTimerRunning,
  minutesToday 
}: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-neutral-900 border-b border-neutral-800 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: App name */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-lg font-semibold text-white tracking-tight">mrror</h1>
        </div>

        {/* Center/Right: Timer + status */}
        <div className="flex items-center gap-6">
          {activeTaskName && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-400">
                {activeTaskName}
              </div>
              {timerDisplay && (
                <div className={`text-xl font-mono font-semibold ${
                  isTimerRunning ? 'text-emerald-400' : 'text-neutral-300'
                }`}>
                  {timerDisplay}
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/50">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Today</span>
            <span className="text-sm font-semibold text-emerald-400">{minutesToday}m</span>
          </div>
        </div>
      </div>
    </header>
  );
}
