'use client';

import { useState, useEffect } from 'react';

interface MissionDebriefProps {
  onComplete: (debrief: string) => void;
}

export default function MissionDebrief({ onComplete }: MissionDebriefProps) {
  const [debrief, setDebrief] = useState('');
  const [displayedPrompt, setDisplayedPrompt] = useState('');

  const promptText = '» MISSION DEBRIEF: What decision today defined your trajectory?';

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
    if (!debrief.trim()) {
      alert('Enter your mission debrief before continuing.');
      return;
    }
    onComplete(debrief);
  };

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

        {/* Text input */}
        <textarea
          value={debrief}
          onChange={(e) => setDebrief(e.target.value)}
          placeholder="Enter your reflection..."
          className="w-full h-40 bg-black border border-cyan-400/50 text-cyan-400 px-4 py-3 font-mono text-xs sm:text-sm placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none"
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!debrief.trim()}
          className={`w-full py-3 px-4 font-mono text-xs sm:text-sm font-bold border-2 transition-all ${
            debrief.trim()
              ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 cursor-pointer'
              : 'border-cyan-400/30 text-cyan-400/50 cursor-not-allowed'
          }`}
        >
          &raquo; PROCEED TO TOMORROW&apos;S DIRECTIVE
        </button>
      </div>
    </div>
  );
}
