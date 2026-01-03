'use client';

import { useState, useEffect } from 'react';

interface Q4Props {
  onComplete: (data: {
    impulseControl: number;
    focusConsistency: number;
    emotionalStability: number;
  }) => void;
}

export default function Q4_FocusControl({ onComplete }: Q4Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showSliders, setShowSliders] = useState(false);
  const [impulseControl, setImpulseControl] = useState(5);
  const [focusConsistency, setFocusConsistency] = useState(5);
  const [emotionalStability, setEmotionalStability] = useState(5);

  const questionText = 'Rate your focus and control yesterday.';

  useEffect(() => {
    let charIndex = 0;
    const typeText = () => {
      if (charIndex < questionText.length) {
        setDisplayedText(questionText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeText, 50);
      } else {
        setTimeout(() => setShowSliders(true), 500);
      }
    };
    typeText();
  }, []);

  const handleSubmit = () => {
    setTimeout(() => {
      onComplete({
        impulseControl,
        focusConsistency,
        emotionalStability,
      });
    }, 500);
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

        {showSliders && (
          <div className="space-y-8">
            {/* Impulse Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#9CA3AF] font-mono text-sm uppercase">
                  Impulse Control
                </label>
                <span className="text-[#00E0FF] font-mono text-2xl glow-cyan">
                  {impulseControl}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={impulseControl}
                onChange={(e) => setImpulseControl(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1B1F23] appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-[#00E0FF]
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]
                         [&::-moz-range-thumb]:w-4
                         [&::-moz-range-thumb]:h-4
                         [&::-moz-range-thumb]:bg-[#00E0FF]
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]"
              />
            </div>

            {/* Focus Consistency */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#9CA3AF] font-mono text-sm uppercase">
                  Focus Consistency
                </label>
                <span className="text-[#00E0FF] font-mono text-2xl glow-cyan">
                  {focusConsistency}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={focusConsistency}
                onChange={(e) => setFocusConsistency(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1B1F23] appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-[#00E0FF]
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]
                         [&::-moz-range-thumb]:w-4
                         [&::-moz-range-thumb]:h-4
                         [&::-moz-range-thumb]:bg-[#00E0FF]
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]"
              />
            </div>

            {/* Emotional Stability */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#9CA3AF] font-mono text-sm uppercase">
                  Emotional Stability
                </label>
                <span className="text-[#00E0FF] font-mono text-2xl glow-cyan">
                  {emotionalStability}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={emotionalStability}
                onChange={(e) => setEmotionalStability(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1B1F23] appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-[#00E0FF]
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]
                         [&::-moz-range-thumb]:w-4
                         [&::-moz-range-thumb]:h-4
                         [&::-moz-range-thumb]:bg-[#00E0FF]
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(0,224,255,0.6)]"
              />
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 font-mono text-sm border-2 border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10 transition-all"
              >
                [ SUBMIT ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
