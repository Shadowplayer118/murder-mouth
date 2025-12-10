// _components/utils/turnHelpers.ts
import {getRandomPosition, GRID_SIZE,  generateTurnOrder} from './gridHelper';
import { CharacterData, Player, Objective, TurnOrderEntry, MovementLog  } from '../types';

export type Directions = 'up' | 'down' | 'left' | 'right';

export const directions: Directions[] = ['up', 'down', 'left', 'right'];

export interface NextTurnParams {
  players: Player[];
  turnOrder: TurnOrderEntry[];
  currentTurnIndex: number;
  objective: Objective | null;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTurnOrder: React.Dispatch<React.SetStateAction<TurnOrderEntry[]>>;
  setCurrentTurnIndex: React.Dispatch<React.SetStateAction<number>>;
  movementLogs: MovementLog[];
  setMovementLogs: React.Dispatch<React.SetStateAction<MovementLog[]>>;
}

export function handleNextTurn(params: NextTurnParams) {
  const {
    players,
    turnOrder,
    currentTurnIndex,
    objective,
    setPlayers,
    setTurnOrder,
    setCurrentTurnIndex,
    movementLogs,
    setMovementLogs,
  } = params;

  if (turnOrder.length === 0) {
    const newOrder = generateTurnOrder(players);
    setTurnOrder(newOrder);
    setCurrentTurnIndex(0);
    return;
  }

  const activeTurn = turnOrder[currentTurnIndex];
  const playerIndex = players.findIndex((p) => p.name === activeTurn.playerName);
  if (playerIndex === -1) return;

  const player = players[playerIndex];
  let [x, y] = player.position;

  // Pick random direction
  const dir = directions[Math.floor(Math.random() * directions.length)];
  let newPos: [number, number] = [x, y];

  switch (dir) {
    case 'up':
      if (y > 0) newPos = [x, y - 1];
      break;
    case 'down':
      if (y < GRID_SIZE - 1) newPos = [x, y + 1];
      break;
    case 'left':
      if (x > 0) newPos = [x - 1, y];
      break;
    case 'right':
      if (x < GRID_SIZE - 1) newPos = [x + 1, y];
      break;
  }

  let announcement = '';

  // Check if position is occupied
  const occupiedPlayer = players.find(
    (p, idx) => idx !== playerIndex && p.position[0] === newPos[0] && p.position[1] === newPos[1]
  );

  if (objective && newPos[0] === objective.position[0] && newPos[1] === objective.position[1]) {
    announcement = `${player.name} reached the objective at [${newPos[0]}, ${newPos[1]}]!`;
  } else if (occupiedPlayer) {
    announcement =
      occupiedPlayer.team === player.team
        ? `${player.name} encountered ally ${occupiedPlayer.name} at [${newPos[0]}, ${newPos[1]}]`
        : `${player.name} encountered enemy ${occupiedPlayer.name} at [${newPos[0]}, ${newPos[1]}]`;
    // If occupied, don’t move
    newPos = [x, y];
  }

  // Update player position
  setPlayers((prev) =>
    prev.map((p, idx) => (idx === playerIndex ? { ...p, position: newPos } : p))
  );

  // Add log
  setMovementLogs([
    ...movementLogs,
    { turn: currentTurnIndex + 1, player: player.name, move: dir, announcement, newPos },
  ]);

  // Advance turn
  if (currentTurnIndex + 1 >= turnOrder.length) {
    const newOrder = generateTurnOrder(players);
    setTurnOrder(newOrder);
    setCurrentTurnIndex(0);
  } else {
    setCurrentTurnIndex(currentTurnIndex + 1);
  }
}
