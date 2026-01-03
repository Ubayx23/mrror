'use client';

import { useState, useEffect, useMemo } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [displayText, setDisplayText] = useState('');
  
  const bootMessages = useMemo(() => [
    '> Initializing MRROR OS...',
    '> Retrieving psychological telemetry from previous day...',
    '> SYSTEM READY FOR DAILY AUDIT.',
  ], []);

  useEffect(() => {
    let charIndex = 0;
    let messageIndex = 0;
    let finalText = '';

    const typeMessage = () => {
      if (messageIndex < bootMessages.length) {
        const currentMessage = bootMessages[messageIndex];

        if (charIndex < currentMessage.length) {
          finalText += currentMessage[charIndex];
          setDisplayText(finalText);
          charIndex++;
          setTimeout(typeMessage, 30);
        } else {
          // Message complete, add line break and move to next
          finalText += '\n';
          setDisplayText(finalText);
          charIndex = 0;
          messageIndex++;
          setTimeout(typeMessage, 400);
        }
      } else {
        // All messages done, transition to main app after delay
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };

    typeMessage();
  }, [onComplete, bootMessages]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* CRT scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="animate-scanlines w-full h-full bg-repeat-y" 
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
             }}>
        </div>
      </div>

      {/* Boot screen content */}
      <div className="relative z-10 text-center">
        <div className="text-[#00E0FF] glow-cyan font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto px-6">
          {displayText}
          {displayText.length < bootMessages.join('\n').length + 3 && (
            <span className="cursor-blink text-[#00E0FF]">▮</span>
          )}
        </div>
      </div>

      {/* Glow effect behind text */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             background: 'radial-gradient(ellipse at center, rgba(0, 224, 255, 0.08) 0%, transparent 70%)',
           }}>
      </div>
      
      {/* Vignette */}
      <div className="vignette"></div>
    </div>
  );
}
