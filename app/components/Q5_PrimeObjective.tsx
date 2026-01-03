'use client';

import { useState, useEffect } from 'react';

interface Q5Props {
  onComplete: (objective: string, executionWindow: string) => void;
}

export default function Q5_PrimeObjective({ onComplete }: Q5Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [objective, setObjective] = useState('');
  const [executionWindow, setExecutionWindow] = useState('Morning');
  const [submitted, setSubmitted] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const questionText = 'What is today\'s prime objective?';
  const processingMessages = [
    '> Mission logged.',
    '> System recalibrating...',
    '> Generating daily report...',
  ];

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

  useEffect(() => {
    if (submitted && processingStep < processingMessages.length) {
      const timer = setTimeout(() => {
        setProcessingStep(processingStep + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (submitted && processingStep === processingMessages.length) {
      setTimeout(() => {
        onComplete(objective, executionWindow);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, processingStep, objective, executionWindow, onComplete]);

  const handleSubmit = () => {
    if (!objective.trim()) {
      alert('Enter your objective');
      return;
    }
    setSubmitted(true);
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
        {!submitted && (
          <>
            <div className="text-[#00E0FF] glow-cyan font-mono text-lg sm:text-2xl mb-12 text-center">
              {displayedText}
              {displayedText.length < questionText.length && (
                <span className="cursor-blink">▮</span>
              )}
            </div>

            {showInput && (
              <div className="space-y-6">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                  className="input-cyber w-full px-6 py-4 font-mono text-base"
                  placeholder="Enter objective..."
                />

                <div className="space-y-3">
                  <label className="block text-[#9CA3AF] font-mono text-sm uppercase text-center">
                    Execution Window
                  </label>
                  <div className="flex gap-4 justify-center">
                    {['Morning', 'Afternoon', 'Evening'].map((window) => (
                      <button
                        key={window}
                        onClick={() => setExecutionWindow(window)}
                        className={`px-6 py-2 font-mono text-sm border-2 transition-all ${
                          executionWindow === window
                            ? 'border-[#00E0FF] bg-[#00E0FF]/20 text-[#00E0FF] glow-cyan'
                            : 'border-[#00E0FF]/40 text-[#00E0FF] hover:border-[#00E0FF]'
                        }`}
                      >
                        {window.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!objective.trim()}
                    className={`px-8 py-3 font-mono text-sm border-2 transition-all ${
                      objective.trim()
                        ? 'border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10'
                        : 'border-[#00E0FF]/20 text-[#00E0FF]/30 cursor-not-allowed'
                    }`}
                  >
                    [ SUBMIT ]
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {submitted && (
          <div className="text-center space-y-3">
            {processingMessages.slice(0, processingStep + 1).map((msg, idx) => (
              <div
                key={idx}
                className="text-[#00E0FF] font-mono text-sm glow-cyan"
              >
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
