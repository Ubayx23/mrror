'use client';

import { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

/**
 * Phase 6: Promise-centric grid layout
 * Better spatial balance, 2-column layout when possible
 * Tighter padding for improved focus
 */
export default function DashboardGrid({ children }: DashboardGridProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <main className="ml-16 mt-14 min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header: Date + Greeting */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">{greeting}</h2>
          <p className="text-xs text-neutral-500">{dateStr}</p>
        </div>

        {/* Grid layout for cards - 2 columns on desktop, dynamic layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {children}
        </div>
      </div>
    </main>
  );
}

/**
 * Reusable Card component for dashboard
 */
export function DashboardCard({ 
  children, 
  className = '',
  fullWidth = false 
}: { 
  children: ReactNode; 
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <div 
      className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 ${
        fullWidth ? 'lg:col-span-2' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
