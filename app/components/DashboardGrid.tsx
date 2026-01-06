'use client';

import { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

/**
 * Phase 4: Card-based dashboard grid
 * Center content area with consistent card styling
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header: Date + Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-1">{greeting}</h2>
          <p className="text-sm text-neutral-400">{dateStr}</p>
        </div>

        {/* Grid layout for cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      className={`bg-neutral-900 border border-neutral-800 rounded-xl p-6 ${
        fullWidth ? 'lg:col-span-3' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
