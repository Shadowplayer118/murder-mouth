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
  
  // Determine HP bar color based on health percentage
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'from-green-500 to-green-400';
    if (healthPercentage > 30) return 'from-yellow-500 to-yellow-400';
    return 'from-red-600 to-red-500';
  };

  return (
    <div className="relative">
      {/* Portrait & Icon Section */}
      <div className="flex items-start gap-3 mb-4">
        {/* Portrait */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-4 border-gray-700 shadow-lg bg-gray-900">
            {portrait ? (
              <img 
                src={portrait} 
                alt="Portrait" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                👤
              </div>
            )}
          </div>
          {/* Icon Badge */}
          {icon && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full overflow-hidden border-3 border-gray-800 bg-gray-900 shadow-lg">
              <img src={icon} alt="Icon" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Name & Title Section */}
        <div className="flex-1 space-y-2">
          <input 
            type="text" 
            placeholder="Character Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800/60 border-2 border-gray-700 rounded-lg px-3 py-2 text-white font-bold text-lg placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
          <input 
            type="text" 
            placeholder="Title / Class" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800/60 border-2 border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors italic"
          />
        </div>
      </div>

      {/* HP Bar - Fighting Game Style */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-400 font-bold tracking-wider">HP</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={health} 
              onChange={(e) => setHealth(parseInt(e.target.value, 10) || 0)}
              className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center font-mono text-sm focus:outline-none focus:border-red-500"
            />
            <span className="text-gray-500 font-mono">/ {maxHealth}</span>
          </div>
        </div>

        {/* HP Bar Container */}
        <div className="relative h-8 bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden shadow-inner">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}></div>
          
          {/* Health Bar Fill */}
          <div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getHealthColor()} transition-all duration-500 ease-out shadow-lg`}
            style={{ width: `${healthPercentage}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent"></div>
            
            {/* Animated pulse for low health */}
            {healthPercentage <= 30 && (
              <div className="absolute inset-0 animate-pulse bg-white/20"></div>
            )}
          </div>

          {/* HP Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-lg tracking-wide" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)'
            }}>
              {health} / {maxHealth}
            </span>
          </div>

          {/* Notches for visual segments */}
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-900/50"
              style={{ left: `${(i + 1) * 20}%` }}
            ></div>
          ))}
        </div>

        {/* Health Status Text */}
        <div className="text-center">
          {healthPercentage > 60 && (
            <span className="text-green-400 text-xs font-semibold">● HEALTHY</span>
          )}
          {healthPercentage > 30 && healthPercentage <= 60 && (
            <span className="text-yellow-400 text-xs font-semibold">⚠ WOUNDED</span>
          )}
          {healthPercentage > 0 && healthPercentage <= 30 && (
            <span className="text-red-400 text-xs font-semibold animate-pulse">⚠ CRITICAL</span>
          )}
          {healthPercentage === 0 && (
            <span className="text-gray-500 text-xs font-semibold">☠ DEFEATED</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterInfo;