'use client';

import { useState, useEffect } from 'react';

interface Q2Props {
  onComplete: (timeWasted: number) => void;
}

export default function Q2_TimeWasted({ onComplete }: Q2Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [hours, setHours] = useState<number | ''>('');
  const [showWarning, setShowWarning] = useState(false);

  const questionText = 'How many hours did you surrender to distraction yesterday?';

  useEffect(() => {
    let charIndex = 0;
    const typeText = () => {
      if (charIndex < questionText.length) {
        setDisplayedText(questionText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeText, 50);
      } else {
        setTimeout(() => setShowInput(true), 500);
      }
    };
    typeText();
  }, []);

  const handleSubmit = () => {
    if (hours === '' || hours < 0 || hours > 16) {
      alert('Enter a valid number between 0 and 16');
      return;
    }

    if (hours > 3) {
      setShowWarning(true);
      setTimeout(() => {
        onComplete(hours as number);
      }, 2000);
    } else {
      setTimeout(() => {
        onComplete(hours as number);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center">
      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-40">
        <div className="w-full h-full animate-scanlines"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
             }}>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className={`text-[#00E0FF] glow-cyan font-mono text-lg sm:text-2xl mb-12 ${showWarning ? 'animate-flicker' : ''}`}>
          {displayedText}
          {displayedText.length < questionText.length && (
            <span className="cursor-blink">▮</span>
          )}
        </div>

        {showInput && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                min="0"
                max="16"
                value={hours}
                onChange={(e) => setHours(e.target.value === '' ? '' : Math.max(0, Math.min(16, parseInt(e.target.value))))}
                onKeyPress={handleKeyPress}
                autoFocus
                className="input-cyber w-32 px-6 py-4 text-center font-mono text-2xl"
                placeholder="0"
              />
              <span className="text-[#9CA3AF] font-mono text-lg">hours</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={hours === ''}
              className={`px-8 py-3 font-mono text-sm border-2 transition-all ${
                hours !== ''
                  ? 'border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10'
                  : 'border-[#00E0FF]/20 text-[#00E0FF]/30 cursor-not-allowed'
              }`}
            >
              [ SUBMIT ]
            </button>
          </div>
        )}

        {showWarning && (
          <div className="mt-8 text-[#FF3B3B] glow-red font-mono text-sm animate-flicker">
            &gt; WARNING: EXCESSIVE TIME LOSS DETECTED.
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
