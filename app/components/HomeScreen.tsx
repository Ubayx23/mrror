'use client';

import { useState, useCallback } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid from '@/app/components/DashboardGrid';
import ActiveTaskCardV2 from '@/app/components/ActiveTaskCardV2';
import InlineTaskSelectorV2 from '@/app/components/InlineTaskSelectorV2';
import StatsCard from '@/app/components/StatsCard';
import NotesPanel from '@/app/components/NotesPanel';
import HabitsCard from '@/app/components/HabitsCard';
import { getMinutesCurrentDay, getSessionsCountToday, getTasksCompletedToday } from '@/app/utils/sessions';

/**
 * Phase 4 refined: Clean command center with all productivity tools
 * Dark mode, calm system dashboard feel
 */
export default function HomeScreen() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTaskName, setActiveTaskName] = useState('');
  const [activeDurationMinutes, setActiveDurationMinutes] = useState(25);
  const [minutestoday, setMinutestoday] = useState(() => getMinutesCurrentDay());
  const [sessionsToday, setSessionsToday] = useState(() => getSessionsCountToday());
  const [tasksCompleted, setTasksCompleted] = useState(() => getTasksCompletedToday());
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
    setSessionsToday(getSessionsCountToday());
    setTasksCompleted(getTasksCompletedToday());
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
            {/* Row 1: Timer + Journal (equal partners) */}
            <ActiveTaskCardV2
              taskId={activeTaskId}
              taskName={activeTaskName}
              durationMinutes={activeDurationMinutes}
              onComplete={handleTaskComplete}
              onTimerUpdate={handleTimerUpdate}
            />
            <NotesPanel />
            
            {/* Row 2: Reflection (Stats + Habits side by side) */}
            <StatsCard 
              minutesToday={minutestoday} 
              sessionsToday={sessionsToday}
              tasksCompleted={tasksCompleted}
            />
            <HabitsCard />
          </>
        ) : (
          <>
            {/* Row 1: Task selector spans 2 columns */}
            <div className="lg:col-span-2">
              <InlineTaskSelectorV2 onSelect={handleTaskSelect} />
            </div>
            <NotesPanel />
            
            {/* Row 2: Reflection (Stats + Habits side by side) */}
            <StatsCard 
              minutesToday={minutestoday} 
              sessionsToday={sessionsToday}
              tasksCompleted={tasksCompleted}
            />
            <HabitsCard />
          </>
        )}
      </DashboardGrid>
    </div>
  );
}
