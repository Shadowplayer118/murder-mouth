import React from "react";

export type TeamMember = {
  name: string;
  title: string;
  Int: string;
  Per: string;
  Def: string;
  Spd: string;
  Dmg: string;
  Total: string;
  movement_type: string;
  role: string;
  max_health: string;
  base_damage: string;
  mvmt_spd: string;
  evasion: string;
  support: string;
  lore: string;
  ability: string;
  portrait: string;
  icon: string;
};

export function TeamContainer({
  teamName,
  coords,
  selectedMembers,
  onChangeMember,
  color,
  characters
}: {
  teamName: string;
  coords: string[];
  selectedMembers: (TeamMember | null)[];
  onChangeMember: (index: number, char: TeamMember | null) => void;
  color: "blue" | "red";
  characters: TeamMember[];
}) {
  const bgColor = color === "blue" ? "bg-blue-500" : "bg-red-500";

  return (
    <div className="mb-4 w-full flex flex-col items-center">
      <h2 className={`text-white font-bold text-xl mb-2 ${bgColor} px-4 py-1 rounded`}>{teamName}</h2>
      <div className="flex gap-2 flex-wrap justify-center">
        {coords.map((coord, i) => (
          <div key={i} className="bg-gray-800 text-white rounded shadow p-2 w-48 flex flex-col items-center">
            <select
              className="mb-1 w-full bg-gray-700 text-white rounded px-1 py-0.5"
              value={selectedMembers[i]?.name ?? ""}
              onChange={(e) => {
                const selectedChar = characters.find(c => c.name === e.target.value) ?? null;
                onChangeMember(i, selectedChar);
              }}
            >
              <option value="">None</option>
              {characters.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            {selectedMembers[i] && (
              <>
                <img src={selectedMembers[i].portrait} alt={selectedMembers[i].name} className="w-16 h-16 rounded-full mb-1" />
                <div className="text-sm font-bold">{selectedMembers[i].name}</div>
                <div className="text-xs mb-1">{selectedMembers[i].role} - {selectedMembers[i].movement_type}</div>
                <div className="text-xs grid grid-cols-2 gap-1 w-full">
                  <span>Int: {selectedMembers[i].Int}</span>
                  <span>Per: {selectedMembers[i].Per}</span>
                  <span>Def: {selectedMembers[i].Def}</span>
                  <span>Spd: {selectedMembers[i].Spd}</span>
                  <span>Dmg: {selectedMembers[i].Dmg}</span>
                  <span>Total: {selectedMembers[i].Total}</span>
                  <span>Max HP: {selectedMembers[i].max_health}</span>
                  <span>Base Dmg: {selectedMembers[i].base_damage}</span>
                  <span>Mvmt Spd: {selectedMembers[i].mvmt_spd}</span>
                  <span>Evasion: {selectedMembers[i].evasion}</span>
                  <span>Support: {selectedMembers[i].support || "N/A"}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
