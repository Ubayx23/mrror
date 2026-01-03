'use client';

import { useState, useEffect } from 'react';
import { getLatestRecord } from '@/app/utils/storage';
import { getSystemStatus } from '@/app/utils/SystemMetrics';

export default function StatusBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [integrity, setIntegrity] = useState(0);
  const [status, setStatus] = useState<'NOMINAL' | 'DEGRADED'>('NOMINAL');

  useEffect(() => {
    const updateDisplay = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

      // Get current integrity from latest record
      const latestRecord = getLatestRecord();
      if (latestRecord) {
        setIntegrity(latestRecord.systemIntegrity);
        setStatus(getSystemStatus(latestRecord.systemIntegrity));
      }
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = status === 'NOMINAL' ? 'text-cyan-400' : 'text-red-500';
  const statusGlow = status === 'NOMINAL' ? 'shadow-lg shadow-cyan-400/50' : 'shadow-lg shadow-red-600/50';

  return (
    <div className="relative z-20 border-t border-cyan-400/30 bg-black/80 backdrop-blur-sm font-mono text-xs sm:text-sm text-cyan-300 px-4 py-2 flex items-center justify-between">
      {/* Left section: Time and Date */}
      <div className="flex items-center gap-4">
        <span>{time}</span>
        <span className="text-cyan-500/60">|</span>
        <span>{date}</span>
      </div>

      {/* Center: System Integrity */}
      <div className="flex items-center gap-2">
        <span className="text-cyan-500/60">»</span>
        <span className={`${statusColor} ${statusGlow} px-3 py-1 rounded`}>
          SYSTEM INTEGRITY: {status} [{integrity}%]
        </span>
      </div>

      {/* Right section: Status indicator */}
      <div className="flex items-center gap-2">
        <span className="text-cyan-500/60">|</span>
        <div className={`w-2 h-2 rounded-full ${status === 'NOMINAL' ? 'bg-cyan-400' : 'bg-red-500'} animate-pulse`}></div>
      </div>
    </div>
  );
}
