'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';

export interface Character {
  id: number;
  name: string;
  title: string;
  stats: { [key: string]: number };
  portrait: string;
  icon: string;
  lore: string;
  ability: string;
}

interface CharacterSelectorProps {
  characters: Character[];
  selectedId: number;
  onSelect: (charId: number) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedId,
  onSelect
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter characters based on search query
  const filteredCharacters = useMemo(() => {
    const query = search.toLowerCase();
    return characters.filter(
      (char) =>
        char.name.toLowerCase().includes(query) ||
        char.title.toLowerCase().includes(query)
    );
  }, [search, characters]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (charId: number) => {
    onSelect(charId);
    setOpen(false);
    const selected = characters.find((c) => c.id === charId);
    if (selected) setSearch(selected.name);
  };

  const selectedCharacter = characters.find((c) => c.id === selectedId);

  return (
    <div ref={containerRef} className="relative w-full mb-4">
      {/* Search input with icon */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search character..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-gray-800/60 border-2 border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('');
              setOpen(true);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Custom dropdown */}
      {open && (
        <div className="absolute w-full mt-2 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {filteredCharacters.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {filteredCharacters.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                    c.id === selectedId
                      ? 'bg-purple-600/30 border-l-4 border-purple-500'
                      : 'hover:bg-gray-800/60 border-l-4 border-transparent'
                  }`}
                >
                  {/* Character Icon */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                    {c.icon ? (
                      <img src={c.icon} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        ⚔️
                      </div>
                    )}
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold truncate">{c.name}</div>
                    <div className="text-gray-400 text-sm truncate italic">{c.title}</div>
                  </div>

                  {/* Selected Indicator */}
                  {c.id === selectedId && (
                    <div className="text-purple-400 flex-shrink-0">✓</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <div>No characters found</div>
              <div className="text-sm mt-1">Try a different search term</div>
            </div>
          )}
        </div>
      )}

      {/* Selected Character Display */}
      {selectedCharacter && !open && (
        <div className="mt-2 p-3 bg-gray-800/40 border border-gray-700 rounded-lg flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-900 border-2 border-purple-500/50 flex-shrink-0">
            {selectedCharacter.icon ? (
              <img src={selectedCharacter.icon} alt={selectedCharacter.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                ⚔️
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{selectedCharacter.name}</div>
            <div className="text-gray-400 text-xs truncate italic">{selectedCharacter.title}</div>
          </div>
          <div className="text-purple-400 text-xs bg-purple-900/30 px-2 py-1 rounded">SELECTED</div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelector;