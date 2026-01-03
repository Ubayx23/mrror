'use client';

import { useState, useEffect } from 'react';
import { calculateSystemIntegrity, calculateRotIndex } from '@/app/utils/SystemMetrics';

interface DailyDiagnosticProps {
  onComplete: (data: {
    impulseControl: number;
    focusConsistency: number;
    emotionalStability: number;
    timeWasted: number;
    systemIntegrity: number;
    rotIndex: number;
  }) => void;
}

export default function DailyDiagnostic({ onComplete }: DailyDiagnosticProps) {
  const [impulseControl, setImpulseControl] = useState<number | ''>('');
  const [focusConsistency, setFocusConsistency] = useState<number | ''>('');
  const [emotionalStability, setEmotionalStability] = useState<number | ''>('');
  const [timeWasted, setTimeWasted] = useState<number | ''>('');
  const [displayedText, setDisplayedText] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const allQuestionsAnswered =
    impulseControl !== '' && focusConsistency !== '' && emotionalStability !== '' && timeWasted !== '';

  // Typewriter effect for initial prompt
  useEffect(() => {
    const prompt = '» INITIATING DAILY DIAGNOSTIC...';
    let charIndex = 0;

    const typePrompt = () => {
      if (charIndex < prompt.length) {
        setDisplayedText(prompt.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typePrompt, 50);
      }
    };

    typePrompt();
  }, []);

  const handleInputChange = (value: string): number | null => {
    if (value === '') return null;
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 10) return num;
    return null;
  };

  const handleSubmit = () => {
    if (!allQuestionsAnswered) {
      alert('Complete all diagnostic queries (0-10 range)');
      return;
    }

    const systemIntegrity = calculateSystemIntegrity(
      impulseControl as number,
      focusConsistency as number,
      emotionalStability as number
    );
    const rotIndex = calculateRotIndex(timeWasted as number);

    setShowResults(true);
    setTimeout(() => {
      onComplete({
        impulseControl: impulseControl as number,
        focusConsistency: focusConsistency as number,
        emotionalStability: emotionalStability as number,
        timeWasted: timeWasted as number,
        systemIntegrity,
        rotIndex,
      });
    }, 2000);
  };

  if (showResults) {
    const systemIntegrity = calculateSystemIntegrity(
      impulseControl as number,
      focusConsistency as number,
      emotionalStability as number
    );
    const rotIndex = calculateRotIndex(timeWasted as number);
    const status = systemIntegrity >= 70 ? 'NOMINAL' : 'DEGRADED';
    const statusColor = status === 'NOMINAL' ? 'text-cyan-400' : 'text-red-500';

    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="text-xs sm:text-sm opacity-75">» DIAGNOSTIC COMPLETE</div>
            <div className={`text-lg sm:text-2xl font-bold ${statusColor}`}>
              SYSTEM INTEGRITY: {status} [{systemIntegrity}%]
            </div>
            <div className="text-xs sm:text-sm opacity-75">
              » ROT INDEX: {rotIndex}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Initial prompt with typewriter effect */}
        <div className="text-xs sm:text-sm opacity-75 min-h-6">
          {displayedText}
          {displayedText.length < '» INITIATING DAILY DIAGNOSTIC...'.length && (
            <span className="animate-pulse">▮</span>
          )}
        </div>

        {/* Diagnostic questions */}
        <div className="space-y-6">
          {/* Question 1: Impulse Control */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm opacity-75">
              » SYSTEM QUERY: Impulse Control (0–10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={impulseControl}
              onChange={(e) => {
                const num = handleInputChange(e.target.value);
                if (num !== null) setImpulseControl(num);
              }}
              onBlur={() => {
                if (impulseControl !== '' && completedQuestions === 0) {
                  setCompletedQuestions(1);
                }
              }}
              placeholder="0-10"
              className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-3 py-2 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          {/* Question 2: Focus Consistency */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm opacity-75">
              » SYSTEM QUERY: Focus Consistency (0–10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={focusConsistency}
              onChange={(e) => {
                const num = handleInputChange(e.target.value);
                if (num !== null) setFocusConsistency(num);
              }}
              onBlur={() => {
                if (focusConsistency !== '' && completedQuestions === 1) {
                  setCompletedQuestions(2);
                }
              }}
              placeholder="0-10"
              className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-3 py-2 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          {/* Question 3: Emotional Stability */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm opacity-75">
              » SYSTEM QUERY: Emotional Stability (0–10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={emotionalStability}
              onChange={(e) => {
                const num = handleInputChange(e.target.value);
                if (num !== null) setEmotionalStability(num);
              }}
              onBlur={() => {
                if (emotionalStability !== '' && completedQuestions === 2) {
                  setCompletedQuestions(3);
                }
              }}
              placeholder="0-10"
              className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-3 py-2 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>

          {/* Question 4: Time Wasted */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm opacity-75">
              » SYSTEM QUERY: Time Wasted (hours)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={timeWasted}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!isNaN(num) && num >= 0 && num <= 24) setTimeWasted(num);
              }}
              onBlur={() => {
                if (timeWasted !== '' && completedQuestions === 3) {
                  setCompletedQuestions(4);
                }
              }}
              placeholder="0-24"
              className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-3 py-2 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered}
          className={`w-full py-3 px-4 font-mono text-xs sm:text-sm font-bold border-2 transition-all ${
            allQuestionsAnswered
              ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 cursor-pointer'
              : 'border-cyan-400/30 text-cyan-400/50 cursor-not-allowed'
          }`}
        >
          » PROCESS DIAGNOSTIC
        </button>
      </div>
    </div>
  );
}
