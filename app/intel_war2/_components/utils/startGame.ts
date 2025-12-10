// components/startGame.ts

import { Player } from "../types";

export function startGameRandomizer(players: Player[]) {
  const used = new Set<string>();

  // only assign coordinates to players with a character
  const newPlayers = players.map(p => {
    if (!p.character) return p; // skip unassigned players

    let pos: [number, number];
    do {
      pos = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
    } while (used.has(pos.toString()));

    used.add(pos.toString());
    return { ...p, position: pos };
  });

  // generate objective in free tile
  let objective: [number, number];
  do {
    objective = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  } while (used.has(objective.toString()));

  return { players: newPlayers, objective };
}

