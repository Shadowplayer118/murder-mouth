// _components/utils/gridHelper.ts

export const GRID_SIZE = 7;

export function getRandomPosition(existingPositions: Set<string>): [number, number] {
  let pos: [number, number];
  do {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    pos = [x, y];
  } while (existingPositions.has(pos.toString()));
  existingPositions.add(pos.toString());
  return pos;
}


// _components/utils/gameHelpers.ts
import type { Player, TurnOrderEntry } from '../types'; // adjust path

export function getRandomTieBreakers(total: number): number[] {
  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

/**
 * Generates a turn order array given the list of players.
 * Does NOT update state; returns array.
 */
export function generateTurnOrder(players: Player[]): TurnOrderEntry[] {
  const selectedPlayers = players.filter((p) => p.character !== null);
  const tieBreakers = getRandomTieBreakers(selectedPlayers.length);

  const order: TurnOrderEntry[] = selectedPlayers.map((p, i) => {
    const mvmt_spd = Number(p.character!.mvmt_spd);
    const randomTieBreaker = tieBreakers[i];
    return {
      playerName: p.name,
      characterName: p.character!.name,
      mvmt_spd,
      randomTieBreaker,
      totalSpeed: mvmt_spd + randomTieBreaker,
    };
  });

  order.sort((a, b) => b.totalSpeed - a.totalSpeed);

  return order;
}



