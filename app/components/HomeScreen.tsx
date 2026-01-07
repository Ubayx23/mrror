'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid from '@/app/components/DashboardGrid';
import DailyPromiseCard from '@/app/components/DailyPromiseCard';
import PromiseResolveCard from '@/app/components/PromiseResolveCard';
import ProofLedger from '@/app/components/ProofLedger';
import NotesPanel from '@/app/components/NotesPanel';
import HabitsCard from '@/app/components/HabitsCard';
import GoalsPanel from '@/app/components/GoalsPanel';
import WeeklyCalendar from '@/app/components/WeeklyCalendar';
import { getTodayPromise, autoFailUnresolvedYesterday, DailyPromise, isDailyCheckInComplete, markOpenedToday } from '@/app/utils/storage';

/**
 * Phase 6: Promise-Centric UI
 * Daily promise is the primary object - timer and journal support it
 * UI communicates: "You are here to keep one word today."
 */
export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isDailyCheckInComplete()) {
      router.replace('/check-in');
    }
    // Track open for fire streak
    markOpenedToday();
  }, [router]);

  const [todayPromise, setTodayPromise] = useState<DailyPromise | null>(() => {
    if (typeof window === 'undefined') return null;
    autoFailUnresolvedYesterday();
    return getTodayPromise();
  });
  const [timerDisplay, setTimerDisplay] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  const handlePromiseCreated = useCallback((promise: DailyPromise) => {
    setTodayPromise(promise);
    setShowResolve(false);
  }, []);

  const handlePromiseChange = useCallback((promise: DailyPromise | null) => {
    setTodayPromise(promise);
  }, []);

  // Timer callbacks are handled within embedded components

  const handlePromiseResolved = useCallback((promise: DailyPromise) => {
    setTodayPromise(promise);
    setShowResolve(false);
    setTimerDisplay('');
    setIsTimerRunning(false);
  }, []);

  const handleCreateAnother = useCallback(() => {
    // Allow creating another promise
    setTodayPromise(null);
    setShowResolve(false);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar 
        activeTaskName={todayPromise?.promise}
        timerDisplay={timerDisplay || undefined}
        isTimerRunning={isTimerRunning}
        minutesToday={0}
      />
      
      <IconRail currentPage="home" />

      <DashboardGrid>
        {/* Main content area */}
        {!todayPromise ? (
          // STATE: No promise created yet
          <>
            {/* Primary Grid: Left Promise (dominant), Right Goals (supportive) */}
            <div className="lg:col-span-1">
              <DailyPromiseCard
                promise={null}
                onPromiseCreated={handlePromiseCreated}
                onPromiseChange={handlePromiseChange}
              />
            </div>
            <div className="lg:col-span-1">
              <GoalsPanel onPrefill={() => {}} />
            </div>

            {/* Proof Ledger (secondary, compact) */}
            <ProofLedger />

            {/* Journal + Habits (bottom row) */}
            <NotesPanel showPrompt="idle" promise={null} />
            <HabitsCard />


            {/* Orientation: Calendar */}
            <div className="lg:col-span-1">
              <WeeklyCalendar />
            </div>
          </>
        ) : todayPromise.state === 'pending' ? (
          // STATE: Promise committed, timer active or waiting
          <>
            {/* Promise card (dominant, left) with embedded timer */}
            <div className="lg:col-span-1">
              <DailyPromiseCard promise={todayPromise} attachTimer onPromiseChange={handlePromiseChange} />
            </div>
            {/* Goals (supportive, right) */}
            <div className="lg:col-span-1">
              <GoalsPanel onPrefill={() => {}} />
            </div>

            {/* Journal (responsive to promise state) */}
            <NotesPanel
              showPrompt={isTimerRunning ? 'active' : 'waiting'}
              promise={todayPromise}
            />

            {/* Resolve or Proof Ledger */}
            {showResolve ? (
              <PromiseResolveCard
                promise={todayPromise}
                onResolved={handlePromiseResolved}
              />
            ) : (
              <ProofLedger />
            )}

            {/* Habits (optional, secondary) */}
            <HabitsCard />


            {/* Orientation: Calendar */}
            <div className="lg:col-span-1">
              <WeeklyCalendar />
            </div>
          </>
        ) : (
          // STATE: Promise completed or broken
          <>
            {/* Show completed/failed promise (dominant, left) */}
            <div className="lg:col-span-1">
              <DailyPromiseCard promise={todayPromise} />
            </div>
            {/* Goals (supportive, right) */}
            <div className="lg:col-span-1">
              <GoalsPanel onPrefill={() => {}} />
            </div>

            {/* Journal (reflection prompt) */}
            <NotesPanel
              showPrompt="reflection"
              promise={todayPromise}
            />

            {/* Proof Ledger */}
            <ProofLedger />

            {/* Button to create another promise */}
            <div className="lg:col-span-2">
              <button
                onClick={handleCreateAnother}
                className="w-full px-4 py-3 bg-blue-600 border border-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                Make a New Statement
              </button>
            </div>

            {/* Habits card */}
            <HabitsCard />


            {/* Orientation: Calendar */}
            <div className="lg:col-span-1">
              <WeeklyCalendar />
            </div>
          </>
        )}
      </DashboardGrid>
    </div>
  );
}
