'use client';

import { useState, useCallback } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import DashboardGrid from '@/app/components/DashboardGrid';
import DailyPromiseCard from '@/app/components/DailyPromiseCard';
import PromiseTimerCard from '@/app/components/PromiseTimerCard';
import PromiseResolveCard from '@/app/components/PromiseResolveCard';
import ProofLedger from '@/app/components/ProofLedger';
import NotesPanel from '@/app/components/NotesPanel';
import HabitsCard from '@/app/components/HabitsCard';
import { getTodayPromise, autoFailUnresolvedYesterday, DailyPromise } from '@/app/utils/storage';

/**
 * Phase 6: Promise-Centric UI
 * Daily promise is the primary object - timer and journal support it
 * UI communicates: "You are here to keep one word today."
 */
export default function HomeScreen() {
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

  const handleTimerUpdate = useCallback((display: string, running: boolean) => {
    setTimerDisplay(display);
    setIsTimerRunning(running);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setShowResolve(true);
  }, []);

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
        {/* Philosophy text - subtle but readable */}
        <div className="lg:col-span-2 mb-2">
          <p className="text-sm text-neutral-400 leading-relaxed">
            Identity changes through completed proof, not intention.
          </p>
        </div>

        {/* Main content area */}
        {!todayPromise ? (
          // STATE: No promise created yet
          <>
            {/* Promise input (full width, dominant) */}
            <div className="lg:col-span-2">
              <DailyPromiseCard
                promise={null}
                onPromiseCreated={handlePromiseCreated}
                onPromiseChange={handlePromiseChange}
              />
            </div>

            {/* Proof Ledger (secondary) */}
            <div className="lg:col-span-2">
              <ProofLedger />
            </div>

            {/* Journal + Habits (bottom row) */}
            <NotesPanel showPrompt="idle" promise={null} />
            <HabitsCard />
          </>
        ) : todayPromise.state === 'pending' ? (
          // STATE: Promise committed, timer active or waiting
          <>
            {/* Promise card (always visible, large) */}
            <div className="lg:col-span-2">
              <DailyPromiseCard promise={todayPromise} />
            </div>

            {/* Timer (below promise, supporting tool) */}
            <div className="lg:col-span-2">
              <PromiseTimerCard
                promise={todayPromise}
                onTimerComplete={handleTimerComplete}
                onTimerUpdate={handleTimerUpdate}
              />
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
          </>
        ) : (
          // STATE: Promise completed or broken
          <>
            {/* Show completed/failed promise */}
            <div className="lg:col-span-2">
              <DailyPromiseCard promise={todayPromise} />
            </div>

            {/* Journal (reflection prompt) */}
            <NotesPanel
              showPrompt="reflection"
              promise={todayPromise}
            />

            {/* Proof Ledger */}
            <div className="lg:col-span-2">
              <ProofLedger />
            </div>

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
          </>
        )}
      </DashboardGrid>
    </div>
  );
}
