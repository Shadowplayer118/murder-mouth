'use client';

import { useEffect, useState } from 'react';
import GridBoard from './GridBoard';
import TeamSelector from './TeamSelector';
import TurnOrderPanel from './TurnOrderPanel';
import MovementController from './MovementController';


type CellType = 'empty' | 'obstruction' | 'objective' | Character;

interface Character {
  name: string;
  role?: string;
  portrait?: string;
  mvmt_spd?: string;
  team?: 'A' | 'B';
}


const GRID_SIZE = 8;
const NUM_OBSTRUCTIONS = 5;

interface TurnCharacter extends Character {
  uniqueNum: number;
  finalSpeed: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function GridWithDesign() {
  const [grid, setGrid] = useState<CellType[][]>(
    Array(GRID_SIZE)
      .fill([])
      .map(() => Array(GRID_SIZE).fill('empty'))
  );
  const [shown, setShown] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [teamA, setTeamA] = useState<(Character | null)[]>(Array(5).fill(null));
  const [teamB, setTeamB] = useState<(Character | null)[]>(Array(5).fill(null));
  const [turnOrder, setTurnOrder] = useState<TurnCharacter[]>([]);
  const [positions, setPositions] = useState<Record<string, [number, number]>>({});
  const [intel, setIntel] = useState<{ A: string[]; B: string[] }>({ A: [], B: [] });

  useEffect(() => {
    fetch('/data/characters.json')
      .then((res) => res.json())
      .then((data) => setAllCharacters(data))
      .catch((err) => console.error(err));
  }, []);

  const generateGrid = () => {
    const newGrid: CellType[][] = Array(GRID_SIZE)
      .fill([])
      .map(() => Array(GRID_SIZE).fill('empty'));

    const getRandomEmptyCell = (): [number, number] => {
      let x: number, y: number;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (newGrid[y][x] !== 'empty');
      return [y, x];
    };

    const newPositions: Record<string, [number, number]> = {};

    // Obstructions
    for (let i = 0; i < NUM_OBSTRUCTIONS; i++) {
      const [y, x] = getRandomEmptyCell();
      newGrid[y][x] = 'obstruction';
    }

    // Objective
    const [objY, objX] = getRandomEmptyCell();
    newGrid[objY][objX] = 'objective';

    // Team A
    teamA.forEach((member) => {
      if (!member) return;
      const [y, x] = getRandomEmptyCell();
      newGrid[y][x] = member;
      newPositions[member.name] = [y, x];
    });

    // Team B
    teamB.forEach((member) => {
      if (!member) return;
      const [y, x] = getRandomEmptyCell();
      newGrid[y][x] = member;
      newPositions[member.name] = [y, x];
    });

    setPositions(newPositions);
    setGrid(newGrid);
    setShown(true);
    calculateTurnOrder();
    setIntel({ A: [], B: [] }); // reset intel
  };

  const handleSelect = (team: 'A' | 'B', index: number, charName: string) => {
    const selected = allCharacters.find((c) => c.name === charName) || null;
    if (team === 'A') {
      const newTeam = [...teamA];
      newTeam[index] = selected;
      setTeamA(newTeam);
    } else {
      const newTeam = [...teamB];
      newTeam[index] = selected;
      setTeamB(newTeam);
    }
  };

  const calculateTurnOrder = () => {
    const selectedCharacters = [...teamA, ...teamB].filter(Boolean) as Character[];

    const turnChars: TurnCharacter[] = selectedCharacters.map((c, idx) => {
      const uniqueNum = idx + 1;
      const mvmtSpdNum = parseInt(c.mvmt_spd || '0', 10);
      return { ...c, uniqueNum, finalSpeed: mvmtSpdNum + uniqueNum };
    });

    turnChars.sort((a, b) => b.finalSpeed - a.finalSpeed);
    setTurnOrder(turnChars);
  };

  // Move first character in turn order randomly
const performAction = () => {
  if (turnOrder.length === 0) return;

  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  const randomDir = directions[Math.floor(Math.random() * directions.length)];

  const char = turnOrder[0];
  const [y, x] = positions[char.name];

  let newY = y;
  let newX = x;

  if (randomDir === 'up') newY = Math.max(0, y - 1);
  if (randomDir === 'down') newY = Math.min(GRID_SIZE - 1, y + 1);
  if (randomDir === 'left') newX = Math.max(0, x - 1);
  if (randomDir === 'right') newX = Math.min(GRID_SIZE - 1, x + 1);

  const targetCell = grid[newY][newX];

  // Determine team key and teams
  const isTeamA = teamA.some((member) => member?.name === char.name);
  const teamKey: 'A' | 'B' = isTeamA ? 'A' : 'B';
  const allyTeam = isTeamA ? teamA : teamB;
  const enemyTeam = isTeamA ? teamB : teamA;

  const newGrid = grid.map((row) => [...row]);

  // Only move if the target cell is empty
  if (targetCell === 'empty') {
    newGrid[y][x] = 'empty';
    newGrid[newY][newX] = char;
    setGrid(newGrid);

    const newPositions = { ...positions, [char.name]: [newY, newX] };
    setPositions(newPositions);
  }

  // Sight calculation
  const sight: string[] = [];
  let checkY = newY;
  let checkX = newX;

  while (true) {
    if (randomDir === 'up') checkY--;
    if (randomDir === 'down') checkY++;
    if (randomDir === 'left') checkX--;
    if (randomDir === 'right') checkX++;
    if (checkY < 0 || checkY >= GRID_SIZE || checkX < 0 || checkX >= GRID_SIZE) break;

    const cell = newGrid[checkY][checkX];
    if (cell === 'empty') continue;
    if (cell === 'obstruction') {
      sight.push('obstruction');
      break;
    }
    if (cell === 'objective') {
      sight.push('objective');
      break;
    }
    if (typeof cell !== 'string') {
      const isAlly = allyTeam.some((member) => member?.name === cell.name);
      sight.push(`${cell.name} (${isAlly ? 'ally' : 'enemy'})`);
      break;
    }
  }

  // Log movement or blocked
  const movementLog =
    targetCell === 'empty'
      ? `${char.name} moves ${randomDir} and sees: ${sight.join(', ') || 'nothing'}`
      : `${char.name} tries to move ${randomDir} but is blocked by ${typeof targetCell === 'string' ? targetCell : targetCell.name}. Sees: ${sight.join(', ') || 'nothing'}`;

  setIntel((prev) => ({
    ...prev,
    [teamKey]: [...prev[teamKey], movementLog],
  }));

  // Remove character from turn order
  setTurnOrder((prev) => prev.slice(1));
};


  return (
    <div className="flex flex-col items-center gap-4 p-4">

        <MovementController
  grid={grid}
  setGrid={setGrid}
  positions={positions}
  setPositions={setPositions}
  turnOrder={turnOrder}
  setTurnOrder={setTurnOrder}
  teamA={teamA}
  teamB={teamB}
  setIntel={setIntel}
  intel={intel}
  GRID_SIZE={GRID_SIZE}
/>
      <button
        onClick={generateGrid}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Grid
      </button>

      {shown && <GridBoard grid={grid} teamA={teamA} />}

      <TeamSelector
        teamName="A"
        team={teamA}
        allCharacters={allCharacters}
        onSelect={handleSelect}
      />
      <TeamSelector
        teamName="B"
        team={teamB}
        allCharacters={allCharacters}
        onSelect={handleSelect}
      />

      <TurnOrderPanel turnOrder={turnOrder} />


      {/* Single Random Action Button */}


      {/* Intel Panels */}
      <div className="flex gap-4 mt-4 w-full max-w-md">
        <div className="flex-1 border p-2 rounded bg-gray-100">
          <h4 className="font-bold">Team A Intel</h4>
          <ul className="list-disc list-inside">
            {intel.A.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
        <div className="flex-1 border p-2 rounded bg-gray-100">
          <h4 className="font-bold">Team B Intel</h4>
          <ul className="list-disc list-inside">
            {intel.B.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
