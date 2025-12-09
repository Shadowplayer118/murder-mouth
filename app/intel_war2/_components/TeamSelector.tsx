'use client';

import React from 'react';

interface Character {
  name: string;
  title?: string;
  Int?: string;
  Per?: string;
  Def?: string;
  Spd?: string;
  Dmg?: string;
  Total?: string;
  movement_type?: string;
  role?: string;
  max_health?: string;
  base_damage?: string;
  mvmt_spd?: string;
  evasion?: string;
  support?: string;
  total?: string;
  lore?: string;
  ability?: string;
  portrait?: string;
  icon?: string;
  team?: 'A' | 'B'; // Added team property
}

interface TeamSelectorProps {
  teamName: 'A' | 'B';
  team: (Character | null)[];
  allCharacters: Character[];
  onSelect: (team: 'A' | 'B', index: number, charName: string) => void;
}

export default function TeamSelector({ teamName, team, allCharacters, onSelect }: TeamSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <h2 className="text-lg font-bold">Team {teamName}</h2>
      {team.map((member, i) => {
        const selected = member;

        return (
          <div key={i} className="flex flex-col items-start gap-2 w-full border p-2 rounded">
            {/* Selector */}
            <select
              value={selected?.name || ''}
              onChange={(e) => {
                const charName = e.target.value;
                if (!charName) return;

                // Make a deep copy and assign team
                const originalChar = allCharacters.find((c) => c.name === charName);
                if (!originalChar) return;
                const charWithTeam: Character = { ...originalChar, team: teamName };

                // Call parent handler with the updated character
                onSelect(teamName, i, charWithTeam.name);
              }}
              className="border p-1 rounded w-full"
            >
              <option value="">Select</option>
              {allCharacters.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} - {c.role}
                </option>
              ))}
            </select>

            {/* Character Data Panel */}
            {selected && (
              <div className="bg-gray-100 p-2 rounded w-full flex gap-2">
                {/* Portrait */}
                {selected.portrait && (
                  <img
                    src={`/images/${selected.portrait}`}
                    alt={selected.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}

                {/* Stats */}
                <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  {selected.name && <p><strong>Name:</strong> {selected.name}</p>}
                  {selected.title && <p><strong>Title:</strong> {selected.title}</p>}
                  {selected.role && <p><strong>Role:</strong> {selected.role}</p>}
                  {selected.movement_type && <p><strong>Movement:</strong> {selected.movement_type}</p>}
                  {selected.Int && <p><strong>Int:</strong> {selected.Int}</p>}
                  {selected.Per && <p><strong>Per:</strong> {selected.Per}</p>}
                  {selected.Def && <p><strong>Def:</strong> {selected.Def}</p>}
                  {selected.Spd && <p><strong>Spd:</strong> {selected.Spd}</p>}
                  {selected.Dmg && <p><strong>Dmg:</strong> {selected.Dmg}</p>}
                  {selected.max_health && <p><strong>HP:</strong> {selected.max_health}</p>}
                  {selected.base_damage && <p><strong>Base Dmg:</strong> {selected.base_damage}</p>}
                  {selected.mvmt_spd && <p><strong>Speed:</strong> {selected.mvmt_spd}</p>}
                  {selected.evasion && <p><strong>Evasion:</strong> {selected.evasion}</p>}
                  {selected.support && <p><strong>Support:</strong> {selected.support}</p>}
                  {selected.team && <p><strong>Team:</strong> {selected.team}</p>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
