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

  const filteredCharacters = useMemo(() => {
    const q = search.toLowerCase();
    return characters.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  }, [search, characters]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: number) => {
    onSelect(id);
    setOpen(false);
    const found = characters.find(c => c.id === id);
    if (found) setSearch(found.name);
  };

  const selectedCharacter = characters.find(c => c.id === selectedId);

  return (
    <div ref={containerRef} className="relative w-full font-mono tracking-wide">

      {/* SEARCH INPUT */}
      <div className="relative text-xs sm:text-sm">
        <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-[#00ff99]/60">🔍</span>

        <input
          type="text"
          placeholder="SCAN SUBJECT FILES..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="
          w-full bg-black border border-[#00ff99]/40 text-[#00ff99]
          px-7 sm:px-10 py-1.5 sm:py-2
          focus:outline-none focus:border-[#00ff99]
          placeholder-[#00ff99]/30 uppercase tracking-widest
          text-xs sm:text-sm
          shadow-[0_0_6px_#00ff9980] focus:shadow-[0_0_12px_#00ff99]
          "
        />

        {search && (
          <button
            onClick={() => { setSearch(''); setOpen(true); }}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#00ff99]/60 hover:text-[#00ffb3] transition text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN LIST */}
      {open && (
        <div className="absolute w-full mt-1 sm:mt-2 bg-black border border-[#00ff99]/40 z-50
                        shadow-[0_0_12px_#00ff9960] animate-in fade-in">

          {filteredCharacters.length > 0 ? (
            <ul className="max-h-48 sm:max-h-64 overflow-y-auto text-xs sm:text-sm
                           scrollbar-thin scrollbar-thumb-[#00ff99]/40 scrollbar-track-black">

              {filteredCharacters.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`
                    flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 cursor-pointer
                    border-l-4 duration-150
                    ${c.id === selectedId
                      ? "border-[#00ff99] bg-[#003321]"
                      : "border-transparent hover:bg-[#001a11]"
                    }`}
                >

                  {/* ICON */}
                  <div className="
                    w-8 h-8 sm:w-10 sm:h-10 
                    border border-[#00ff99]/40 bg-black flex items-center justify-center overflow-hidden">
                    {c.icon ? <img src={`/images/${c.icon}`} alt={c.name} className="object-cover w-full h-full" />
                            : <span className="text-[#00ff99]/50">⚔</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[#00ff99] font-bold truncate">{c.name}</p>
                    <p className="text-[#00ff99]/60 text-[10px] sm:text-xs italic truncate">{c.title}</p>
                  </div>

                  {c.id === selectedId && <span className="text-[#00ff99] text-xs font-bold">◆</span>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 sm:p-5 text-center text-[#00ff99]/50 italic text-xs">
              No Subject Records Found...
            </div>
          )}
        </div>
      )}

      {/* SELECTED CHARACTER MINI PANEL */}
      {selectedCharacter && !open && (
        <div className="mt-2 p-1.5 sm:p-2 border border-[#00ff99]/40 bg-black flex items-center gap-2 sm:gap-3">

          <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#00ff99]/70 overflow-hidden">
            <img src={`/images/${selectedCharacter.icon}`} className="object-cover w-full h-full" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#00ff99] font-bold truncate text-xs sm:text-sm">{selectedCharacter.name}</p>
            <p className="text-[#00ff99]/50 text-[10px] sm:text-xs italic truncate">{selectedCharacter.title}</p>
          </div>

          <span className="text-[10px] sm:text-xs text-black bg-[#00ff99] px-1.5 sm:px-2 py-0.5">
            ACTIVE
          </span>
        </div>
      )}

    </div>
  );
};

export default CharacterSelector;
