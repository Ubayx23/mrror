'use client';

import { useState, useCallback } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid from '@/app/components/DashboardGrid';
import ActiveTaskCardV2 from '@/app/components/ActiveTaskCardV2';
import InlineTaskSelectorV2 from '@/app/components/InlineTaskSelectorV2';
import StatsCard from '@/app/components/StatsCard';
import { getMinutesCurrentDay } from '@/app/utils/sessions';

/**
 * Phase 4: Dashboard layout with top bar, icon rail, and card-based grid
 * Dark mode, calm system dashboard feel
 */
export default function HomeScreen() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTaskName, setActiveTaskName] = useState('');
  const [activeDurationMinutes, setActiveDurationMinutes] = useState(25);
  const [minutestoday, setMinutestoday] = useState(() => getMinutesCurrentDay());
  const [timerDisplay, setTimerDisplay] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleTaskSelect = useCallback((taskId: string, taskName: string, durationMinutes: number) => {
    setActiveTaskId(taskId);
    setActiveTaskName(taskName);
    setActiveDurationMinutes(durationMinutes);
  }, []);

  const handleTaskComplete = useCallback(() => {
    setActiveTaskId(null);
    setActiveTaskName('');
    setMinutestoday(getMinutesCurrentDay());
    setTimerDisplay('');
    setIsTimerRunning(false);
  }, []);

  const handleTimerUpdate = useCallback((display: string, running: boolean) => {
    setTimerDisplay(display);
    setIsTimerRunning(running);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar 
        activeTaskName={activeTaskId ? activeTaskName : undefined}
        timerDisplay={timerDisplay || undefined}
        isTimerRunning={isTimerRunning}
        minutesToday={minutestoday}
      />
      
      <IconRail currentPage="home" />

      <DashboardGrid>
        {activeTaskId ? (
          <>
            <ActiveTaskCardV2
              taskId={activeTaskId}
              taskName={activeTaskName}
              durationMinutes={activeDurationMinutes}
              onComplete={handleTaskComplete}
              onTimerUpdate={handleTimerUpdate}
            />
            <StatsCard minutesToday={minutestoday} />
          </>
        ) : (
          <>
            <InlineTaskSelectorV2 onSelect={handleTaskSelect} />
            <StatsCard minutesToday={minutestoday} />
          </>
        )}
      </DashboardGrid>
    </div>
  );
}
