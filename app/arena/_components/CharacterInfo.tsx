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
  name, setName,
  title, setTitle,
  health, setHealth,
  portrait, icon
}) => {

  const maxHealth = 20;
  const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  const getHealthColor = () => {
    if (healthPercentage > 60) return 'from-green-500 to-green-400 shadow-green-500';
    if (healthPercentage > 30) return 'from-yellow-500 to-yellow-400 shadow-yellow-400';
    return 'from-red-600 to-red-500 shadow-red-500';
  };

  return (
    <div className="
      bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700/50
      rounded-lg p-2 sm:p-3 md:p-4 shadow-xl text-gray-200
      space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn
    ">

      {/* Portrait + Icon */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">

        <div className="relative group">
          
          {/* SMALLER IMAGE SIZES NOW */}
          <div className="
            w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 
            rounded-lg overflow-hidden border-2 border-gray-700 bg-gray-900 shadow-lg
          ">
            {portrait ? (
              <img src={`/images/${portrait}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="flex items-center justify-center h-full text-xl sm:text-3xl md:text-4xl text-gray-500">👤</div>
            )}
          </div>

          {icon && (
            <div className="
              absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 md:-bottom-2 md:-right-2
              w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 rounded-full overflow-hidden 
              border-2 border-purple-500 shadow-lg
            ">
              <img src={`/images/${icon}`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Name + Title Input Area */}
        <div className="flex-1 space-y-1 sm:space-y-1.5 md:space-y-2">

          <input
            value={name}
            onChange={(e)=> setName(e.target.value)}
            className="
              w-full bg-gray-900/70 border border-gray-700 rounded-md 
              px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2
              text-sm sm:text-base md:text-lg font-bold text-white 
              placeholder-gray-500 focus:border-yellow-400 outline-none
            "
            placeholder="Character Name"
          />

          <input
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            className="
              w-full bg-gray-900/70 border border-gray-700 rounded-md 
              px-2 sm:px-2.5 md:px-3 py-1
              text-xs sm:text-sm italic text-gray-300 placeholder-gray-600
              focus:border-yellow-400 outline-none
            "
            placeholder="Title / Class"
          />

        </div>
      </div>

      {/* HP + BAR */}
      <div className="space-y-1 sm:space-y-1.5 md:space-y-2">

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-red-400 font-bold tracking-wider">HP</span>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={health}
              onChange={(e)=> setHealth(parseInt(e.target.value)||0)}
              className="
                w-10 sm:w-12 md:w-16 text-center bg-gray-900 border border-gray-700 rounded
                p-1 text-xs sm:text-sm text-white font-mono focus:border-red-400 outline-none
              "
            />
            <span className="text-gray-500 font-mono text-[0.65rem] sm:text-xs">/ {maxHealth}</span>
          </div>
        </div>

        <div className="
          relative h-4 sm:h-5 md:h-7
          bg-gray-950 border border-gray-700 rounded overflow-hidden shadow-inner
        ">
          <div
            style={{ width:`${healthPercentage}%` }}
            className={`h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-500`}
          >
            <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center font-bold 
                          text-[0.6rem] sm:text-[0.7rem] md:text-sm text-white drop-shadow-md">
            {health} / {maxHealth}
          </div>
        </div>

        <p className="text-center text-[0.6rem] sm:text-[0.7rem] md:text-xs font-semibold mt-1">
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
