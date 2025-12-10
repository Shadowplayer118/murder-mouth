import { useEffect, useState } from 'react';
import { getRandomPosition, GRID_SIZE, generateTurnOrder } from './utils/gridHelper';
import { CharacterData, Player, Objective, TurnOrderEntry, MovementLog } from './types';
import { handleNextTurn as baseHandleNextTurn, directions } from './utils/turnHelper';
import PlayerSelector from './PlayerSelector';
import TurnOrderTable from './TurnOrderTable';
import MovementLogTable from './MovementLogTable';

export default function GameSetup() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [objective, setObjective] = useState<Objective | null>(null);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [turnOrder, setTurnOrder] = useState<TurnOrderEntry[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);
  const [teamIntel, setTeamIntel] = useState<{ [team: string]: string[] }>({ X: [], Y: [] });

  useEffect(() => {
    fetch('/data/characters.json')
      .then(res => res.json())
      .then((data: CharacterData[]) => setCharacters(data));
  }, []);

  useEffect(() => {
    const existingPositions = new Set<string>();
    const newPlayers: Player[] = [];

    for (let i = 1; i <= 5; i++) {
      newPlayers.push({
        name: `x-${i}`,
        team: 'X',
        position: getRandomPosition(existingPositions),
        character: null,
      });
    }
    for (let i = 1; i <= 5; i++) {
      newPlayers.push({
        name: `y-${i}`,
        team: 'Y',
        position: getRandomPosition(existingPositions),
        character: null,
      });
    }

    const objPos = getRandomPosition(existingPositions);
    setPlayers(newPlayers);
    setObjective({ position: objPos });
  }, [characters]);

  const handleSelectCharacter = (playerIndex: number, characterName: string) => {
    const selectedChar = characters.find(c => c.name === characterName) || null;
    setPlayers(prev => prev.map((p, i) => (i === playerIndex ? { ...p, character: selectedChar } : p)));
  };

  const handleNextTurn = () => {
    const result = baseHandleNextTurn({
      players,
      turnOrder,
      currentTurnIndex,
      objective,
      setPlayers,
      setTurnOrder,
      setCurrentTurnIndex,
      movementLogs,
      setMovementLogs,
    });

    // Scan in the direction moved
    const currentPlayer = players.find(p => p.name === turnOrder[currentTurnIndex].playerName);

    if (!currentPlayer) return;

    const dir = result.lastMoveDirection; // assume handleNextTurn returns last move direction
    const [x, y] = currentPlayer.position;
    let scanned: string | null = null;

    for (let i = 1; i <= GRID_SIZE; i++) {
      let nx = x, ny = y;
      if (dir === 'up') nx -= i;
      else if (dir === 'down') nx += i;
      else if (dir === 'left') ny -= i;
      else if (dir === 'right') ny += i;

      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;

      // Check for objective
      if (objective && objective.position[0] === nx && objective.position[1] === ny) {
        scanned = `Objective spotted at [${nx},${ny}]`;
        break;
      }

      // Check for other players
      const other = players.find(p => p.position[0] === nx && p.position[1] === ny);
      if (other) {
        if (other.team !== currentPlayer.team) {
          scanned = `Enemy spotted at [${nx},${ny}]`;
          break;
        } else if (other.character?.max_health === 0) {
          scanned = `Downed teammate at [${nx},${ny}]`;
          break;
        }
      }
    }

    if (scanned) {
      // Add to movement log
      setMovementLogs(prev => [
        ...prev,
        {
          turn: currentTurnIndex + 1,
          player: currentPlayer.name,
          move: dir,
          newPos: currentPlayer.position,
          announcement: scanned,
        },
      ]);

      // Add to team intel
      setTeamIntel(prev => ({
        ...prev,
        [currentPlayer.team]: [...(prev[currentPlayer.team] || []), scanned],
      }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Players:</h2>
      <PlayerSelector players={players} characters={characters} onSelectCharacter={handleSelectCharacter} />
      <button
        onClick={handleNextTurn}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Next Turn
      </button>

      <TurnOrderTable turnOrder={turnOrder} currentTurnIndex={currentTurnIndex} />
      <MovementLogTable movementLogs={movementLogs} />

      {objective && (
        <p className="mt-4 text-white">
          Objective: [{objective.position[0]}, {objective.position[1]}]
        </p>
      )}

      <div className="mt-4 text-white">
        <h2 className="text-lg font-bold">Team Intel</h2>
        {Object.entries(teamIntel).map(([team, intel]) => (
          <div key={team}>
            <p className="font-semibold">Team {team}:</p>
            <ul>
              {intel.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
