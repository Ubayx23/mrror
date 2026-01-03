'use client';

import { useState, useEffect } from 'react';

interface Q3Props {
  onComplete: (excuseLog: string) => void;
}

export default function Q3_ExcuseLog({ onComplete }: Q3Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [excuse, setExcuse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const questionText = 'When discipline slipped, what excuse won?';

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
    if (!excuse.trim()) {
      alert('Enter your response');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      onComplete(excuse);
    }, 1500);
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
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-[#00E0FF] glow-cyan font-mono text-lg sm:text-2xl mb-12 text-center">
          {displayedText}
          {displayedText.length < questionText.length && (
            <span className="cursor-blink">▮</span>
          )}
        </div>

        {showInput && !submitted && (
          <div className="space-y-6">
            <textarea
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
              autoFocus
              rows={4}
              className="input-cyber w-full px-6 py-4 font-mono text-base resize-none"
              placeholder="Enter reason..."
            />

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!excuse.trim()}
                className={`px-8 py-3 font-mono text-sm border-2 transition-all ${
                  excuse.trim()
                    ? 'border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10'
                    : 'border-[#00E0FF]/20 text-[#00E0FF]/30 cursor-not-allowed'
                }`}
              >
                [ SUBMIT ]
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="text-center space-y-2">
            <div className="text-[#00E0FF] font-mono text-sm">
              &gt; Reason logged.
            </div>
            <div className="text-[#9CA3AF] font-mono text-sm">
              &gt; Excuse archived.
            </div>
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
