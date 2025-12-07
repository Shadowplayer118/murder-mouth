"use client";

import { useEffect, useState } from "react";


interface Character {
  name: string;
  title: string;
  stats: {
    Int: number;
    Per: number;
    Def: number;
    Spd: number;
    Dmg: number;
  };
  lore: string;
  portrait: string;
  icon: string;
  ability: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

useEffect(() => {
  fetch('/data/characters.json')
    .then((res) => res.json())
    .then((data) => {
      // Map JSON to Character type
      const formatted: Character[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.title || '',
        stats: {
          Int: Number(c.Int || 0),
          Per: Number(c.Per || 0),
          Def: Number(c.Def || 0),
          Spd: Number(c.Spd || 0),
          Dmg: Number(c.Dmg || 0),
        },
        portrait: c.portrait || 'default.jpg',
        icon: c.icon || 'default.jpg',
        lore: c.lore || '',
        ability: c.ability || '',
      }));
      setCharacters(formatted);
    })
    .catch((err) => console.error('Failed to load characters:', err));
}, []);


  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatIcon = (stat: string) => {
    const icons: { [key: string]: string } = {
      'Int': '🧠',
      'Per': '👁️',
      'Def': '🛡️',
      'Spd': '⚡',
      'Dmg': '⚔️'
    };
    return icons[stat] || '📊';
  };

  const getStatColor = (stat: string) => {
    const colors: { [key: string]: string } = {
      'Int': 'text-blue-300',
      'Per': 'text-blue-300',
      'Def': 'text-blue-300',
      'Spd': 'text-blue-300',
      'Dmg': 'text-red-400'
    };
    return colors[stat] || 'text-gray-400';
  };

  const getThreatLevel = (stats: any) => {
    const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;
    if (total >= 80) return { level: 'KETER', color: 'text-red-500', bg: 'bg-red-950/50 border-red-900' };
    if (total >= 60) return { level: 'EUCLID', color: 'text-yellow-500', bg: 'bg-yellow-950/50 border-yellow-900' };
    return { level: 'SAFE', color: 'text-green-500', bg: 'bg-green-950/50 border-green-900' };
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-l-4 border-black pl-4 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-4xl">⚠️</div>
            <div>
              <div className="text-red-600 font-bold text-xs tracking-widest mb-1">CLASSIFIED</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black uppercase tracking-tight">
                Subject Database
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Clearance Level 4 Required • Document #ARC-████
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 pt-4 border-t-2 border-black">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH BY NAME OR DESIGNATION..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-2 border-gray-400 px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors font-mono text-sm uppercase tracking-wide"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-700 font-mono">
                Found {filteredCharacters.length} matching record{filteredCharacters.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-700">
            <p>⚠️ WARNING: Unauthorized access is prohibited. All activity is monitored.</p>
          </div>
        </div>

        {/* Character Grid - File Folders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredCharacters.map((char, index) => {
            const threat = getThreatLevel(char.stats);
            return (
              <div
                key={index}
                onClick={() => setSelectedChar(char)}
                className={`bg-amber-50 border-2 border-gray-400 rounded-sm shadow-md transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  selectedChar?.name === char.name
                    ? 'border-red-600 shadow-lg'
                    : 'hover:border-gray-600'
                }`}
              >
                {/* File Tab */}
                <div className="bg-amber-100 border-b-2 border-gray-400 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📁</span>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      SUBJECT-{String(index + 1).padStart(3, '0')}
                    </span>
                  </div>
                  <div className={`text-[10px] font-bold ${threat.color} bg-black/5 px-2 py-0.5 rounded`}>
                    {threat.level}
                  </div>
                </div>

                {/* File Content */}
                <div className="p-4">
                  {/* Portrait - Censored Style */}
                  <div className="relative mb-3">
                    <div className="w-full aspect-square rounded-sm overflow-hidden border-2 border-gray-600 bg-gray-200 relative">
                      <img
                        src={`/images/${char.portrait}`}
                        alt={char.name}
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                      {/* Redacted bars */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black"></div>
                    </div>
                    {/* Classification Stamp */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full overflow-hidden border-2 border-red-700 bg-red-50 flex items-center justify-center shadow-lg">
                      <span className="text-red-700 font-bold text-xs">█</span>
                    </div>
                  </div>

                  {/* Name & Title - Redacted Style */}
                  <div className="mb-3 bg-white p-2 border border-gray-300">
                    <div className="text-black font-bold text-sm uppercase tracking-wider mb-1">
                      {char.name}
                    </div>
                    <div className="text-gray-600 text-xs uppercase tracking-wide border-l-2 border-gray-400 pl-2">
                      {char.title}
                    </div>
                  </div>

                  {/* Quick Stats - Data Grid */}
                  <div className="grid grid-cols-5 gap-1 text-center text-xs bg-gray-100 p-2 border border-gray-300">
                    {Object.entries(char.stats).map(([key, value]) => (
                      <div key={key} className="bg-white border border-gray-300 p-1">
                        <div className="text-gray-500 text-[10px] font-bold">{key}</div>
                        <div className="text-black font-bold text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Character Detail Modal - Classified Document */}
        {selectedChar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-100 rounded-sm border-4 border-black shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Document Header */}
              <div className="bg-black text-white p-4 border-b-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <div className="text-red-500 font-bold text-xs tracking-widest">TOP SECRET // EYES ONLY</div>
                      <div className="text-xl font-bold uppercase tracking-wide">SUBJECT FILE</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChar(null)}
                    className="text-white hover:text-red-500 transition-colors text-2xl font-bold bg-neutral-800 w-10 h-10 flex items-center justify-center rounded hover:bg-neutral-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-amber-50">
                {/* Subject Header */}
                <div className="bg-white border-2 border-black p-6 mb-6 shadow-lg">
                  <div className="flex items-start gap-6 mb-4">
                    <div className="w-32 h-32 rounded-sm overflow-hidden border-4 border-black shadow-lg flex-shrink-0 relative">
                      <img
                        src={`/images/${selectedChar.portrait}`}
                        alt={selectedChar.name}
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                      {/* Redaction bars */}
                      <div className="absolute inset-0 border-8 border-black/20 pointer-events-none"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-red-600 font-bold text-xs tracking-widest mb-2">DESIGNATION:</div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-black uppercase tracking-tight mb-2">
                        {selectedChar.name}
                      </h2>
                      <div className="bg-gray-900 text-white px-3 py-1 inline-block text-sm uppercase tracking-wide mb-3">
                        {selectedChar.title}
                      </div>
                      <div className={`inline-block px-4 py-2 border-2 ${getThreatLevel(selectedChar.stats).bg} ${getThreatLevel(selectedChar.stats).color} font-bold text-lg`}>
                        ⚠️ {getThreatLevel(selectedChar.stats).level} CLASS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistical Analysis */}
                <div className="mb-6">
                  <div className="bg-black text-white px-4 py-2 font-bold text-sm uppercase tracking-wide mb-2">
                    █ Statistical Analysis
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white border-2 border-gray-400 p-4">
                    {Object.entries(selectedChar.stats).map(([key, value]) => (
                      <div key={key} className="border-2 border-gray-300 p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2 border-b border-gray-400 pb-1">
                          <span className="text-sm">{getStatIcon(key)}</span>
                          <span className="text-gray-600 text-xs font-bold uppercase">{key}</span>
                        </div>
                        <div className="text-3xl font-bold text-black mb-2">{value}</div>
                        <div className="h-2 bg-gray-300 border border-gray-400 overflow-hidden">
                          <div
                            className="h-full bg-black transition-all duration-500"
                            style={{ width: `${(value / 20) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 text-right font-mono">
                          [{value}/20]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Containment Procedures */}
                <div className="mb-6">
                  <div className="bg-red-900 text-white px-4 py-2 font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Special Abilities</span>
                  </div>
                  <div className="bg-white border-2 border-red-900 p-5">
                    <p className="text-black text-base leading-relaxed font-mono">{selectedChar.ability}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="bg-black text-white px-4 py-2 font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span>📋</span>
                    <span>Subject Background</span>
                  </div>
                  <div className="bg-white border-2 border-gray-400 p-5">
                    <p className="text-gray-800 text-sm leading-relaxed font-mono">{selectedChar.lore}</p>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="mt-6 pt-4 border-t-2 border-black text-xs text-gray-600 font-mono">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-bold">Document ID:</div>
                      <div>ARC-{Math.random().toString(36).substring(7).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="font-bold">Last Updated:</div>
                      <div>{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-red-600 font-bold">
                    ⚠️ DO NOT DISTRIBUTE WITHOUT PROPER AUTHORIZATION
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / No Results */}
        {filteredCharacters.length === 0 && characters.length > 0 && (
          <div className="text-center py-20 bg-white border-2 border-gray-400 shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl font-mono uppercase">NO MATCHING RECORDS FOUND</p>
            <div className="mt-4 text-sm text-gray-500 font-mono">
              Search query: "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 bg-black text-white px-6 py-2 text-sm font-mono uppercase hover:bg-gray-800 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Loading State */}
        {characters.length === 0 && (
          <div className="text-center py-20 bg-white border-2 border-gray-400 shadow-lg">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-600 text-xl font-mono">LOADING CLASSIFIED FILES...</p>
            <div className="mt-4 text-xs text-gray-500 font-mono">Document retrieval in progress...</div>
          </div>
        )}
      </div>
    </div>
  );
}