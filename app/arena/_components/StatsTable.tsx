'use client';

import React from "react";

export interface Stat {
  label: string;
  value: number;
}

interface StatsTableProps {
  stats: Stat[];
  onChange: (index: number, value: number) => void;
}

const StatsTable: React.FC<StatsTableProps> = ({ stats, onChange }) => {

  const [isOpen, setIsOpen] = React.useState(true);

  const getStatIcon = (label: string) => {
    const icons: Record<string, string> = {
      Health: "❤️", Attack: "⚔️", Defense: "🛡️", Speed: "⚡",
      Magic: "✨", Strength: "💪", Agility: "🏃", Intelligence: "🧠",
      Luck: "🍀", Stamina: "💚", Mana: "💙", Critical: "💥",
    };
    return icons[label] || "📊";
  };

  const getStatColor = (label: string) => {
    const colors: Record<string, string> = {
      Health: "from-red-600 to-red-400",
      Attack: "from-orange-600 to-orange-400",
      Defense: "from-blue-600 to-blue-400",
      Speed: "from-yellow-500 to-yellow-300",
      Magic: "from-purple-600 to-purple-400",
      Strength: "from-red-700 to-red-500",
      Agility: "from-green-500 to-green-400",
      Intelligence: "from-indigo-500 to-indigo-400",
      Luck: "from-pink-500 to-pink-400",
      Stamina: "from-emerald-500 to-emerald-400",
      Mana: "from-cyan-500 to-cyan-400",
      Critical: "from-amber-500 to-amber-400",
    };
    return colors[label] || "from-gray-600 to-gray-500";
  };

  const visibleStats = stats.filter(s => s.label !== "Health");

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700/50 rounded-lg shadow-xl overflow-hidden">

      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-bold text-gray-200">Statistics</h3>
          <span className="text-sm text-gray-400 bg-gray-700/30 px-2 py-0.5 rounded-full">
            {visibleStats.length}
          </span>
        </div>

        <span className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Collapsible Section */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-2 border-t border-gray-700/40">

          {visibleStats.map((stat, i) => {
            const index = stats.findIndex(s => s.label === stat.label);
            const max = 50;
            const percent = Math.min(100, (stat.value / max) * 100);

            return (
              <div key={i} className="bg-gray-800/30 border border-gray-700/40 p-2 rounded-lg backdrop-blur-sm">

                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                    <span>{getStatIcon(stat.label)}</span> {stat.label}
                  </div>

                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => onChange(index, +e.target.value || 0)}
                    min={0} max={99}
                    className="w-12 px-1.5 py-0.5 text-xs bg-gray-900 border border-gray-700 text-white rounded text-center font-mono focus:border-yellow-500/60 outline-none"
                  />
                </div>

                {/* Stat Bar */}
                <div className="relative h-2 rounded bg-gray-900/70 border border-gray-700/40 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getStatColor(stat.label)} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent"></div>
                  </div>
                </div>

              </div>
            );
          })}

          {visibleStats.length === 0 && (
            <div className="text-gray-500 text-center italic py-6 text-sm">
              No stats assigned...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTable;
