'use client';

import React, { useEffect, useState } from 'react';

const GLITCH_CHARS = '!@#$%^&*()_+=-<>?/{}[]~ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MainMenu() {
  const originalText = 'ORGANIZATION DATABASE';
  const [glitchText, setGlitchText] = useState(originalText);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dots, setDots] = useState('');

  // Sporadic text movement with auto-return
  useEffect(() => {
    const sporadicMovement = () => {
      const bursts = Math.floor(Math.random() * 3) + 3; // 3-5 quick movements
      let count = 0;

      const burstInterval = setInterval(() => {
        const maxOffset = 5;
        const newX = Math.floor(Math.random() * (maxOffset * 2 + 1)) - maxOffset;
        const newY = Math.floor(Math.random() * (maxOffset * 2 + 1)) - maxOffset;
        setPosition({ x: newX, y: newY });
        count++;

        if (count >= bursts) {
          clearInterval(burstInterval);
          // Return to original position after a short delay
          setTimeout(() => setPosition({ x: 0, y: 0 }), 50);
        }
      }, 50 + Math.random() * 100);
    };

    const interval = setInterval(() => {
      sporadicMovement();
    }, 5000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, []);

  // Random letter glitching
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = originalText.split('').map((c) => {
        if (Math.random() < 0.15 && c !== ' ') {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        return c;
      });
      setGlitchText(chars.join(''));

      setTimeout(() => setGlitchText(originalText), 150);
    }, 2000 + Math.random() * 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Progressive Decrypting Dots
  useEffect(() => {
    let count = 0;
    const dotsInterval = setInterval(() => {
      count = (count + 1) % 4; // 0,1,2,3
      setDots('.'.repeat(count));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 font-mono relative overflow-hidden">
      {/* Rough rectangle background */}
      <div className="absolute inset-0 border-4  rounded-sm shadow-[0_0_20px_#00ff99] bg-black/30 animate-pulse"></div>

      {/* Glitching Text */}
      <h1
        className="relative text-center text-5xl sm:text-6xl font-bold tracking-widest px-12 py-8 transition-transform duration-75 ease-in-out select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {glitchText}
      </h1>

      {/* Decrypting dots */}
      <div className="mt-4 text-xl text-[#00ff99] font-bold">
        DECRYPTING{dots}
      </div>
    </div>
  );
}
