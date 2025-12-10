"use client";

import React from "react";
import { CharacterData } from "./types";

interface Props {
  players: { id: string; team: "X" | "Y" }[];
  characterList: CharacterData[];
  onSelect: (playerId: string, character: CharacterData) => void;
}

export default function CharacterSelect({ players, characterList, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 p-4 mt-4 bg-gray-800 rounded-lg text-white">

      {players.map(p => (
        <div key={p.id} className="p-3 border rounded border-gray-600">
          <p className="font-bold text-yellow-300 mb-2">Select for {p.id} ({p.team})</p>

          <select
            onChange={(e) => {
              const char = characterList.find(c => c.name === e.target.value);
              if (char) onSelect(p.id, char);
            }}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="">-- Choose Character --</option>
            {characterList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

        </div>
      ))}

    </div>
  );
}
