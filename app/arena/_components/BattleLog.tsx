'use client';

import React from 'react';

interface BattleLogProps {
  log: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="border-2 border-[#00ff99] bg-black text-[#00ff99] font-mono select-none">

      {/* HEADER */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 tracking-widest 
                   border-b border-[#00ff99] hover:bg-[#002a1c] transition-all duration-200"
      >
        <span className="uppercase font-bold">SYSTEM LOG FEED</span>

        <span className={`text-xl transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* COLLAPSIBLE CONTENT */}
      <div className={`transition-all duration-300 overflow-hidden 
                       ${isExpanded ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"}`}>

        <div className="p-2 h-[60vh] overflow-y-auto leading-tight tracking-wide 
                        scrollbar-thin scrollbar-thumb-[#00ff99] scrollbar-track-black">

          {/* EMPTY STATE */}
          {log.length === 0 && (
            <div className="text-[#00ff99]/50 italic text-center mt-10">
              Awaiting SCP engagement protocol..._
              <span className="animate-pulse">█</span>
            </div>
          )}

          {/* NEWEST FIRST — reversed feed */}
          {[...log].reverse().map((entry, index) => (
            <div key={index} className="border-b border-[#00ff99]/20 py-[3px]">
              <span className="text-[#00ffb3] pr-2">
                [#{log.length - index}]
              </span>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleLog;
