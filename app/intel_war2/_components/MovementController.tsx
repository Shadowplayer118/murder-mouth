'use client';

type Direction = 'up' | 'down' | 'left' | 'right';

type CellType = 'empty' | 'obstruction' | 'objective' | Character;

interface Character {
  name: string;
  role?: string;
  portrait?: string;
  mvmt_spd?: string;
}

interface TurnCharacter extends Character {
  uniqueNum: number;
  finalSpeed: number;
}

interface MovementControllerProps {
  grid: CellType[][];
  setGrid: (grid: CellType[][]) => void;
  positions: Record<string, [number, number]>;
  setPositions: (positions: Record<string, [number, number]>) => void;
  turnOrder: TurnCharacter[];
  setTurnOrder: (turnOrder: TurnCharacter[]) => void;
  teamA: (Character | null)[];
  teamB: (Character | null)[];
  setIntel: (intel: { A: string[]; B: string[] }) => void;
  intel: { A: string[]; B: string[] };
  GRID_SIZE: number;
}

export default function MovementController({
  grid,
  setGrid,
  positions,
  setPositions,
  turnOrder,
  setTurnOrder,
  teamA,
  teamB,
  setIntel,
  intel,
  GRID_SIZE,
}: MovementControllerProps) {

  const regenerateTurnOrder = () => {
    const selectedCharacters = [...teamA, ...teamB].filter(Boolean) as Character[];
    const newTurnOrder: TurnCharacter[] = selectedCharacters.map((c, idx) => {
      const uniqueNum = idx + 1;
      const mvmtSpdNum = parseInt(c.mvmt_spd || '0', 10);
      return { ...c, uniqueNum, finalSpeed: mvmtSpdNum + uniqueNum };
    });
    newTurnOrder.sort((a, b) => b.finalSpeed - a.finalSpeed);
    setTurnOrder(newTurnOrder);
    return newTurnOrder;
  };

  const performAction = () => {
    let currentTurnOrder = turnOrder;
    if (turnOrder.length === 0) {
      currentTurnOrder = regenerateTurnOrder();
      if (currentTurnOrder.length === 0) return;
    }

    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];

    const char = currentTurnOrder[0];
    const [y, x] = positions[char.name];

    let newY = y;
    let newX = x;

    if (randomDir === 'up') newY = Math.max(0, y - 1);
    if (randomDir === 'down') newY = Math.min(GRID_SIZE - 1, y + 1);
    if (randomDir === 'left') newX = Math.max(0, x - 1);
    if (randomDir === 'right') newX = Math.min(GRID_SIZE - 1, x + 1);

    const targetCell = grid[newY][newX];

    // Determine team key and ally/enemy teams
    const isTeamA = teamA.filter(Boolean).some((member) => member!.name === char.name);
    const teamKey: 'A' | 'B' = isTeamA ? 'A' : 'B';
    const allyTeam = isTeamA ? teamA : teamB;
    const enemyTeam = isTeamA ? teamB : teamA;

    // Sight calculation (from current position, regardless of move)
    const sight: string[] = [];
    let checkY = y;
    let checkX = x;

    while (true) {
      if (randomDir === 'up') checkY--;
      if (randomDir === 'down') checkY++;
      if (randomDir === 'left') checkX--;
      if (randomDir === 'right') checkX++;
      if (checkY < 0 || checkY >= GRID_SIZE || checkX < 0 || checkX >= GRID_SIZE) break;

      const cell = grid[checkY][checkX];
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
        const isAlly = allyTeam.filter(Boolean).some((member) => member!.name === cell.name);
        sight.push(`${cell.name} (${isAlly ? 'ally' : 'enemy'})`);
        break;
      }
    }

    // Log the action
    const moveResult =
      typeof targetCell !== 'string' || targetCell === 'obstruction'
        ? 'cannot move'
        : `moves ${randomDir}`;
    setIntel({
      ...intel,
      [teamKey]: [
        ...intel[teamKey],
        `${char.name} ${moveResult} and sees: ${sight.join(', ') || 'nothing'}`,
      ],
    });

    // Only move if the target is empty
    if (typeof targetCell === 'string' && targetCell !== 'obstruction') {
      const newGrid = grid.map((row) => [...row]);
      newGrid[y][x] = 'empty';
      newGrid[newY][newX] = char;
      setGrid(newGrid);

      const newPositions = { ...positions, [char.name]: [newY, newX] };
      setPositions(newPositions);
    }

    // Remove character from turn order
    setTurnOrder((prev) => prev.slice(1));
  };

  return (
    <button
      onClick={performAction}
      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Perform Next Action
    </button>
  );
}
