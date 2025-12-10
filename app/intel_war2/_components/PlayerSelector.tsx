'use client';

import React from 'react';
import { Player, CharacterData } from './types';

type PlayerSelectorProps = {
  players: Player[];
  characters: CharacterData[];
  onSelectCharacter: (playerIndex: number, characterName: string) => void;
};

export default function PlayerSelector({
  players,
  characters,
  onSelectCharacter,
}: PlayerSelectorProps) {
  return (
    <ul className="mb-4 space-y-2">
      {players.map((p, index) => (
        <li key={p.name} className="text-white">
          {p.name} (Team {p.team}) - Position: [{p.position[0]}, {p.position[1]}] <br />
          Character: {p.character ? p.character.name : 'None'} <br />
          <select
            value={p.character?.name || ''}
            onChange={(e) => onSelectCharacter(index, e.target.value)}
            className="bg-black text-white px-3 py-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Character --</option>
            {characters.map((c) => (
              <option key={c.name} value={c.name} className="bg-black text-white">
                {c.name}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}
