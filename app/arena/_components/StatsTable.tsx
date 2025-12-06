'use client';

import React from 'react';

export interface Stat {
  label: string;
  value: number;
}

interface StatsTableProps {
  stats: Stat[];
  onChange: (index: number, value: number) => void;
}

const StatsTable: React.FC<StatsTableProps> = ({ stats, onChange }) => {
  // Icon mapping for different stat types
  const getStatIcon = (label: string) => {
    const icons: { [key: string]: string } = {
      'Health': '❤️',
      'Attack': '⚔️',
      'Defense': '🛡️',
      'Speed': '⚡',
      'Magic': '✨',
      'Strength': '💪',
      'Agility': '🏃',
      'Intelligence': '🧠',
      'Luck': '🍀',
      'Stamina': '💚',
      'Mana': '💙',
      'Critical': '💥'
    };
    return icons[label] || '📊';
  };

  // Color coding for stat bars
  const getStatColor = (label: string) => {
    const colors: { [key: string]: string } = {
      'Health': 'bg-red-500',
      'Attack': 'bg-orange-500',
      'Defense': 'bg-blue-500',
      'Speed': 'bg-yellow-500',
      'Magic': 'bg-purple-500',
      'Strength': 'bg-red-600',
      'Agility': 'bg-green-500',
      'Intelligence': 'bg-indigo-500',
      'Luck': 'bg-pink-500',
      'Stamina': 'bg-emerald-500',
      'Mana': 'bg-cyan-500',
      'Critical': 'bg-amber-500'
    };
    return colors[label] || 'bg-gray-500';
  };

  const visibleStats = stats.filter(stat => stat.label !== 'Health');

  return (
    <div className="space-y-1.5 mt-3">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span className="text-sm">📊</span>
        <span>Stats</span>
      </div>

      <div className="space-y-1.5">
        {visibleStats.map((stat, idx) => {
          const actualIdx = stats.findIndex(s => s.label === stat.label);
          const maxStatValue = 50;
          const percentage = Math.min(100, (stat.value / maxStatValue) * 100);

          return (
            <div 
              key={actualIdx}
              className="bg-gray-800/40 rounded p-2 border border-gray-700/50 hover:bg-gray-800/60 transition-colors"
            >
              {/* Stat Label and Value */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{getStatIcon(stat.label)}</span>
                  <span className="text-gray-300 font-semibold text-xs">{stat.label}</span>
                </div>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => onChange(actualIdx, parseInt(e.target.value, 10) || 0)}
                  className="w-12 bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-white text-center font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  min="0"
                  max="99"
                />
              </div>

              {/* Stat Bar */}
              <div className="relative h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700/50">
                <div
                  className={`absolute inset-y-0 left-0 ${getStatColor(stat.label)} transition-all duration-300 ease-out rounded-full`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleStats.length === 0 && (
        <div className="text-center py-4 text-gray-500 italic text-xs">
          No stats available
        </div>
      )}
    </div>
  );
};

export default StatsTable;