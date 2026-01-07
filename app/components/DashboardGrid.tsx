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

  let firstName = 'there';
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('mrror-firstName');
      if (stored) firstName = stored.split(' ')[0];
    } catch {}
  }

  return (
    <main className="ml-16 mt-14 min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header: Greeting + Philosophy */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">Hello, {firstName}</h2>
          <p className="text-lg font-semibold text-white">Identity changes through completed proof, not intention.</p>
          <p className="text-xs text-neutral-600 mt-2">{dateStr}</p>
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
