import { Player, PlayerWithSpeed } from "../types";
import { startGameRandomizer } from "./startGame";


interface ActionResult {
  players: Player[];
  objective: [number, number] | null;
  logEntry: string;
  nextTurnIndex: number;
}

export function handleAction(
  players: Player[],
  turnOrder: PlayerWithSpeed[],
  currentTurnIndex: number,
  objective: [number, number] | null
): ActionResult {
  let updatedPlayers = [...players];
  let updatedObjective = objective;
  let logEntry = "";
  let nextTurnIndex = currentTurnIndex;

  // generate new turn order if needed
  if (turnOrder.length === 0 || currentTurnIndex >= turnOrder.length) {
    const { default: calculateTurnOrder } = require("./calculateTurnOrder");
    const newTurnOrder = calculateTurnOrder(players);
    return {
      players,
      objective,
      logEntry: "--- New Turn Order Generated ---",
      nextTurnIndex: 0,
    };
  }

  const activePlayer = turnOrder[currentTurnIndex];
  if (!activePlayer.character) return { players, objective, logEntry, nextTurnIndex: currentTurnIndex + 1 };

  const action = Math.random() < 0.5 ? "move" : "view";
  let found = false;

  for (let attempt = 1; attempt <= 5; attempt++) {
    const coord: [number, number] = [
      Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 8)
    ];

    if (action === "move") {
      const occupyingPlayer = updatedPlayers.find(
        p => p.position?.[0] === coord[0] && p.position?.[1] === coord[1]
      );

      if (occupyingPlayer) {
        if (occupyingPlayer.team === activePlayer.team) {
          logEntry = `Regrouped with ${occupyingPlayer.character?.name ?? occupyingPlayer.id}`;
        } else {
          logEntry = `Engaging enemy at (${coord[0]}, ${coord[1]})`;
        }
        found = true;
        break;
      } else if (objective && coord[0] === objective[0] && coord[1] === objective[1]) {
        logEntry = `${activePlayer.character.name} → Objective Secured!`;
        updatedPlayers = updatedPlayers.map(p =>
          p.id === activePlayer.id ? { ...p, position: [...objective] } : p
        );
        const { objective: newObjective } = startGameRandomizer(updatedPlayers);
        updatedObjective = newObjective;
        found = true;
        break;
      } else {
        updatedPlayers = updatedPlayers.map(p =>
          p.id === activePlayer.id ? { ...p, position: coord } : p
        );
        logEntry = `${activePlayer.character.name} moved to (${coord[0]}, ${coord[1]})`;
        found = true;
        break;
      }
    } else if (action === "view") {
      const foundPlayer = updatedPlayers.find(
        p => p.position?.[0] === coord[0] && p.position?.[1] === coord[1]
      );

      if (objective && coord[0] === objective[0] && coord[1] === objective[1]) {
        logEntry = `${activePlayer.character.name} → Objective spotted at (${coord[0]}, ${coord[1]})`;
        found = true;
        break;
      } else if (foundPlayer) {
        if (foundPlayer.team === activePlayer.team) {
          logEntry = `${activePlayer.character.name} → You're clear ${foundPlayer.character?.name ?? foundPlayer.id}`;
        } else {
          logEntry = `${activePlayer.character.name} → Enemy spotted at (${coord[0]}, ${coord[1]})`;
        }
        found = true;
        break;
      }
    }
  }

  if (!found) {
    logEntry = action === "move"
      ? `${activePlayer.character.name} → Could not move after searching 5 locations.`
      : `${activePlayer.character.name} → Nothing found after scanning 5 locations.`;
  }

  return {
    players: updatedPlayers,
    objective: updatedObjective,
    logEntry,
    nextTurnIndex: currentTurnIndex + 1,
  };
}
