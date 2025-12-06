'use client';

import React from 'react';

interface CharacterInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  health: number;
  setHealth: (value: number) => void;
  portrait: string | null;
  icon: string | null;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({
  name,
  setName,
  title,
  setTitle,
  health,
  setHealth,
  portrait,
  icon
}) => {
  const maxHealth = 20;
  const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  const getHealthColor = () => {
    if (healthPercentage > 60) return 'from-green-500 to-green-400 shadow-green-500';
    if (healthPercentage > 30) return 'from-yellow-500 to-yellow-400 shadow-yellow-400';
    return 'from-red-600 to-red-500 shadow-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700/50
                    rounded-lg p-4 shadow-xl text-gray-200 animate-fadeIn space-y-4">

      {/* Portrait + Icon */}
      <div className="flex gap-4 items-center">
        
        <div className="relative group">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-900 shadow-lg">
            {portrait ? (
              <img src={portrait} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
            ) : (
              <div className="flex items-center justify-center h-full text-4xl text-gray-600">👤</div>
            )}
          </div>

          {icon && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
              <img src={icon} className="w-full h-full object-cover"/>
            </div>
          )}
        </div>

        {/* Editable Name + Title */}
        <div className="flex-1 space-y-2">
          <input
            value={name}
            onChange={(e)=> setName(e.target.value)}
            placeholder="Character Name"
            className="w-full bg-gray-900/70 border border-gray-700 px-3 py-2 rounded-md text-lg font-bold 
                       focus:border-yellow-400 outline-none transition text-white placeholder-gray-500"
          />

          <input
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            placeholder="Title / Class"
            className="w-full bg-gray-900/70 border border-gray-700 px-3 py-1.5 rounded-md text-sm italic
                       text-gray-300 placeholder-gray-600 focus:border-yellow-400 outline-none transition"
          />
        </div>
      </div>

      {/* Health Panel */}
      <div className="space-y-2">

        <div className="flex justify-between items-center text-sm">
          <span className="text-red-400 font-bold tracking-wider">HP</span>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={health}
              onChange={(e)=> setHealth(parseInt(e.target.value)||0)}
              className="w-16 text-center bg-gray-900 border border-gray-700 p-1 rounded font-mono 
                        text-white focus:border-red-400 outline-none"
            />
            <span className="text-gray-500 font-mono">/ {maxHealth}</span>
          </div>
        </div>

        {/* HP BAR */}
        <div className="relative h-7 bg-gray-950 border border-gray-700 rounded overflow-hidden shadow-inner">

          {/* Fill */}
          <div
            style={{ width:`${healthPercentage}%` }}
            className={`h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-500`}
          >
            {/* Subtle light sweep */}
            <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white drop-shadow-md">
            {health} / {maxHealth}
          </div>

        </div>

        {/* Status */}
        <p className="text-center text-xs font-semibold mt-1">
          {healthPercentage > 60 && <span className="text-green-400">● HEALTHY</span>}
          {healthPercentage > 30 && healthPercentage <= 60 && <span className="text-yellow-400">⚠ WOUNDED</span>}
          {healthPercentage > 0 && healthPercentage <= 30 && <span className="text-red-400 animate-pulse">⚠ CRITICAL</span>}
          {healthPercentage === 0 && <span className="text-gray-500">☠ SIGNAL LOST</span>}
        </p>

      </div>

    </div>
  );
};

export default CharacterInfo;
