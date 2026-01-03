'use client';

import { useState, useEffect } from 'react';

interface TomorrowDirectiveProps {
  onComplete: (objective: string, executionWindow: string) => void;
}

export default function TomorrowDirective({ onComplete }: TomorrowDirectiveProps) {
  const [objective, setObjective] = useState('');
  const [executionWindow, setExecutionWindow] = useState('');
  const [displayedPrompt, setDisplayedPrompt] = useState('');

  const promptText = '» ENTERING TOMORROW\'S DIRECTIVE...';

  // Typewriter effect for prompt
  useEffect(() => {
    let charIndex = 0;

    const typePrompt = () => {
      if (charIndex < promptText.length) {
        setDisplayedPrompt(promptText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typePrompt, 50);
      }
    };

    typePrompt();
  }, []);

  const handleSubmit = () => {
    if (!objective.trim() || !executionWindow.trim()) {
      alert('Complete both fields before proceeding.');
      return;
    }
    onComplete(objective, executionWindow);
  };

  const bothFilled = objective.trim() && executionWindow.trim();

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Typewriter prompt */}
        <div className="text-xs sm:text-sm opacity-75 min-h-6">
          {displayedPrompt}
          {displayedPrompt.length < promptText.length && (
            <span className="animate-pulse">▮</span>
          )}
        </div>

        {/* Objective input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm opacity-75">
            &raquo; ENTER TOMORROW&apos;S PRIME OBJECTIVE:
          </label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Your primary goal..."
            className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-4 py-3 font-mono text-xs sm:text-sm placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Execution window input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm opacity-75">
            » CONFIRM EXECUTION WINDOW (e.g., 6AM–10AM):
          </label>
          <input
            type="text"
            value={executionWindow}
            onChange={(e) => setExecutionWindow(e.target.value)}
            placeholder="Time block for execution..."
            className="w-full bg-black border border-cyan-400/50 text-cyan-400 px-4 py-3 font-mono text-xs sm:text-sm placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!bothFilled}
          className={`w-full py-3 px-4 font-mono text-xs sm:text-sm font-bold border-2 transition-all ${
            bothFilled
              ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 cursor-pointer'
              : 'border-cyan-400/30 text-cyan-400/50 cursor-not-allowed'
          }`}
        >
          &raquo; LOCK IN TOMORROW&apos;S DIRECTIVE
        </button>
      </div>
    </div>
  );
}
