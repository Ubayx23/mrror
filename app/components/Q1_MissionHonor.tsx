'use client';

import { useState, useEffect } from 'react';

interface Q1Props {
  onComplete: (missionSuccess: boolean) => void;
}

export default function Q1_MissionHonor({ onComplete }: Q1Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const questionText = 'Did you honor the version of yourself you promised to become yesterday?';

  useEffect(() => {
    let charIndex = 0;
    const typeText = () => {
      if (charIndex < questionText.length) {
        setDisplayedText(questionText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeText, 50);
      } else {
        setTimeout(() => setShowButtons(true), 500);
      }
    };
    typeText();
  }, []);

  const handleAnswer = (answer: boolean) => {
    setSelected(answer);
    
    if (!answer) {
      setShowWarning(true);
      setTimeout(() => {
        onComplete(answer);
      }, 2000);
    } else {
      setTimeout(() => {
        onComplete(answer);
      }, 800);
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

        {showButtons && (
          <div className="flex gap-6 justify-center items-center">
            <button
              onClick={() => handleAnswer(true)}
              disabled={selected !== null}
              className={`px-12 py-4 font-mono text-lg border-2 transition-all ${
                selected === true
                  ? 'border-[#00E0FF] bg-[#00E0FF]/20 text-[#00E0FF] glow-cyan'
                  : 'border-[#00E0FF]/40 text-[#00E0FF] hover:border-[#00E0FF] hover:bg-[#00E0FF]/10'
              }`}
            >
              [YES]
            </button>
            
            <button
              onClick={() => handleAnswer(false)}
              disabled={selected !== null}
              className={`px-12 py-4 font-mono text-lg border-2 transition-all ${
                selected === false
                  ? 'border-[#FF3B3B] bg-[#FF3B3B]/20 text-[#FF3B3B] glow-red animate-glitch'
                  : 'border-[#00E0FF]/40 text-[#00E0FF] hover:border-[#00E0FF] hover:bg-[#00E0FF]/10'
              }`}
            >
              [NO]
            </button>
          </div>
        )}

        {showWarning && (
          <div className="mt-8 text-[#FF3B3B] glow-red font-mono text-sm animate-flicker">
            &gt; INTEGRITY BREACH DETECTED.
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
