"use client";

import React, { useState } from "react";
import { CharacterData } from "./types";

interface Props {
  players: { id: string; team: "X" | "Y" }[];
  characterList: CharacterData[];
  onSelect: (playerId: string, character: CharacterData) => void;
}

export default function CharacterSelect({ players, characterList, onSelect }: Props) {
  const [selected, setSelected] = useState<Record<string, CharacterData | null>>({});

  const handleSelect = (playerId: string, charName: string) => {
    const char = characterList.find(c => c.name === charName) || null;

    setSelected(prev => ({ ...prev, [playerId]: char }));

    if (char) onSelect(playerId, char);
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4 mt-4 bg-gray-800 rounded-lg text-white">

      {players.map(p => {
        const chosen = selected[p.id];

        return (
          <div key={p.id} className="p-3 border rounded border-gray-600">
            <p className="font-bold text-yellow-300 mb-2">
              Select for {p.id} ({p.team})
            </p>

            {/* Character Dropdown */}
            <select
              onChange={(e) => handleSelect(p.id, e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">-- Choose Character --</option>
              {characterList.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Display selected character info */}
            {chosen && (
              <div className="mt-4 flex flex-col items-center gap-2 p-3 bg-gray-700 rounded">
                
                {/* Character Image */}
                <img
                  src={`/images/${chosen.portrait}`}
                  alt={chosen.name}
                  className="w-20 h-20 object-cover rounded border border-gray-500"
                />

                {/* Character Name */}
                <p className="text-lg font-bold text-blue-300">{chosen.name}</p>

                {/* Max Health */}
                <p className="text-sm text-green-300">
                  Max Health: <span className="font-bold">{chosen.max_health}</span>
                </p>

              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}
