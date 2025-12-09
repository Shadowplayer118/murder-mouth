import React from "react";
import { TeamMember } from "./TeamContainer";
import TeamManager from "./TeamManager";
import TurnOrder, { PlayerTurn } from "./TurnOrder";

type PiecesMap = Record<string, React.ReactNode>;

export type ChessboardProps = {
  squareSize?: number;
  pieces?: PiecesMap;
  whiteOnBottom?: boolean;
  showCoords?: boolean;
};

function ObjectiveContainer({ square, onRegenerate }: { square: string | null; onRegenerate: () => void; }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 mb-3">
      <div className="text-lg font-bold text-yellow-400">
        ⭐ Objective: <span className="text-white">{square ?? "None"}</span>
      </div>
      <button
        onClick={onRegenerate}
        className="px-4 py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400 active:scale-95 transition"
      >
        🔄 Regenerate Objective + Layout
      </button>
    </div>
  );
}

const FILES = ["A","B","C","D","E","F","G","H"];
const RANKS = [8,7,6,5,4,3,2,1];

export default function Chessboard({ squareSize = 64, pieces = {}, whiteOnBottom = true, showCoords = false }: ChessboardProps) {
  const files = whiteOnBottom ? FILES : [...FILES].reverse();
  const ranks = whiteOnBottom ? RANKS : [...RANKS].reverse();

  const [layoutKey, setLayoutKey] = React.useState(0);
  const [characters, setCharacters] = React.useState<TeamMember[]>([]);
  const [turnOrder, setTurnOrder] = React.useState<PlayerTurn[]>([]);

  React.useEffect(() => {
    fetch("/data/characters.json")
      .then(res => res.json())
      .then(data => setCharacters(data))
      .catch(err => console.error("Failed to load characters:", err));
  }, []);

  const allSquares = files.flatMap(file => ranks.map(rank => `${file.toLowerCase()}${rank}`));
  const emptySquares = allSquares.filter(sq => !pieces[sq]);
  const shuffled = [...emptySquares].sort(() => Math.random() - 0.5);

  const obstructionSquares = shuffled.slice(0,5);
  const objectiveSquare = shuffled[5];
  const availableAfterCore = shuffled.slice(6);

  const teamACoords = availableAfterCore.slice(0,5);
  const teamBCoords = availableAfterCore.slice(5,10);

  const [teamAMembers, setTeamAMembers] = React.useState<(TeamMember | null)[]>(Array(teamACoords.length).fill(null));
  const [teamBMembers, setTeamBMembers] = React.useState<(TeamMember | null)[]>(Array(teamBCoords.length).fill(null));

  /** Build board pieces with optional turn info */
  const generatedPieces: PiecesMap = {
    ...pieces,
    ...Object.fromEntries(obstructionSquares.map(sq => [sq, "❎"])),
    [objectiveSquare]: "⭐",
    ...Object.fromEntries(teamACoords.map((sq, i) => {
      const member = teamAMembers[i];
      const turnInfo = turnOrder.find(p => p.name === member?.name);
      return [sq,
        <div key={sq} className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-blue-400 shadow-[0_0_10px_4px_rgb(0,140,255)] text-xs text-white text-center">
          {member?.name ?? "🟦"}
          {turnInfo && <span className="text-[8px]">{turnInfo.assignedNumber} | {turnInfo.totalSpeed}</span>}
        </div>
      ];
    })),
    ...Object.fromEntries(teamBCoords.map((sq, i) => {
      const member = teamBMembers[i];
      const turnInfo = turnOrder.find(p => p.name === member?.name);
      return [sq,
        <div key={sq} className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-red-400 shadow-[0_0_10px_4px_rgb(255,60,60)] text-xs text-white text-center">
          {member?.name ?? "🟥"}
          {turnInfo && <span className="text-[8px]">{turnInfo.assignedNumber} | {turnInfo.totalSpeed}</span>}
        </div>
      ];
    })),
  };

  function regenerate() { 
    setLayoutKey(k => k + 1);
    setTurnOrder([]);
  }

  return (
    <div key={layoutKey} className="flex flex-col items-center w-full">
      <ObjectiveContainer square={objectiveSquare} onRegenerate={regenerate} />

      <TeamManager
        characters={characters}
        teamACoords={teamACoords}
        teamBCoords={teamBCoords}
        teamAMembers={teamAMembers}
        setTeamAMembers={setTeamAMembers}
        teamBMembers={teamBMembers}
        setTeamBMembers={setTeamBMembers}
      />

      {/* Turn Order Component */}
      <TurnOrder
        teamAMembers={teamAMembers}
        teamBMembers={teamBMembers}
      />

      {/* Chessboard */}
      <div className="flex items-center justify-center p-4">
        <div className="inline-grid grid-rows-1 gap-2">
          <div className="flex items-center justify-center">
            <div className="grid" style={{ gridTemplateColumns: `auto ${squareSize*8}px auto` }}>
              {/* Top coords */}
              <div style={{ width: squareSize, height: squareSize }} />
              <div style={{ width: squareSize*8 }}>
                <div className="grid" style={{ gridTemplateColumns: `repeat(8, ${squareSize}px)` }}>
                  {files.map(f => <div key={f} className="flex justify-center pb-1 text-sm font-medium select-none">{f}</div>)}
                </div>
              </div>
              <div style={{ width: squareSize, height: squareSize }} />

              {ranks.map(rank => (
                <React.Fragment key={rank}>
                  <div className="flex items-center justify-center text-sm font-medium select-none" style={{ width: squareSize }}>{rank}</div>
                  <div style={{ width: squareSize*8 }}>
                    <div className="grid" style={{ gridTemplateColumns: `repeat(8, ${squareSize}px)` }}>
                      {files.map(file => {
                        const coord = `${file.toLowerCase()}${rank}`;
                        const indexF = FILES.indexOf(file);
                        const indexR = RANKS.indexOf(rank);
                        const isLight = (indexF + indexR) % 2 === 0;
                        const bg = isLight ? "bg-gray-200" : "bg-gray-600";
                        return (
                          <div key={coord} className={`relative flex items-center justify-center border ${bg}`} style={{ width: squareSize, height: squareSize }}>
                            {generatedPieces[coord]}
                            {showCoords && <span className="absolute bottom-0 right-0 text-[10px] pr-1 opacity-70 select-none">{coord}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-sm font-medium select-none" style={{ width: squareSize }}>{rank}</div>
                </React.Fragment>
              ))}

              {/* Bottom coords */}
              <div style={{ width: squareSize, height: squareSize }} />
              <div style={{ width: squareSize*8 }}>
                <div className="grid" style={{ gridTemplateColumns: `repeat(8, ${squareSize}px)` }}>
                  {files.map(f => <div key={f} className="flex justify-center pt-1 text-sm font-medium select-none">{f}</div>)}
                </div>
              </div>
              <div style={{ width: squareSize, height: squareSize }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
