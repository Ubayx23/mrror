'use client';

import React from 'react';
import StatusBar from './StatusBar';

interface TerminalLayoutProps {
  children: React.ReactNode;
}

export default function TerminalLayout({ children }: TerminalLayoutProps) {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
      {/* CRT scanlines overlay - always visible */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-40">
        <div className="w-full h-full animate-scanlines"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
             }}>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Terminal glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 pointer-events-none opacity-20"
             style={{
               background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.2) 0%, transparent 70%)',
             }}>
        </div>

        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>

      {/* Status bar at bottom */}
      <StatusBar />
    </div>
  );
}
