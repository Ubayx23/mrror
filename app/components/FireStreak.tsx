'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardGrid';
import { markOpenedToday, getFireStreak } from '@/app/utils/storage';

export default function FireStreak() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    markOpenedToday();
    setStreak(getFireStreak());
  }, []);

  return (
    <DashboardCard>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Fire Streak</h3>
          <p className="text-sm text-neutral-300">{streak} day{streak === 1 ? '' : 's'}</p>
        </div>
        <div className="text-2xl">🔥</div>
      </div>
    </DashboardCard>
  );
}
