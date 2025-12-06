'use client';

import React from 'react';

interface BattleLogProps {
  log: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-lg border-2 border-gray-700/50 overflow-hidden shadow-xl">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📜</span>
          <h3 className="text-xl font-bold text-gray-200">Battle Log</h3>
          <span className="bg-gray-700/50 text-gray-300 text-sm px-2 py-1 rounded-full">
            {log.length} {log.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <span className={`text-2xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="border-t border-gray-700/50">
          <div className="p-4 max-h-80 overflow-y-auto space-y-2">
            {log.length === 0 ? (
              <div className="text-gray-500 italic text-center py-8">
                No actions yet. The battle awaits...
              </div>
            ) : (
              [...log].reverse().map((entry, index) => (
                <div
                  key={index}
                  className="bg-gray-800/40 border-l-4 border-yellow-500/50 p-3 rounded text-gray-300 hover:bg-gray-800/60 transition-colors"
                >
                  <span className="text-yellow-400/70 font-mono text-xs mr-2">
                    #{log.length - index}
                  </span>
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleLog;