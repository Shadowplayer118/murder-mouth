import { Player } from "../types";

export type PlayerWithSpeed = Player & { uniqueRandom: number; final_speed: number };

export function calculateTurnOrder(players: Player[]): PlayerWithSpeed[] {
  // only active players (with character)
  const activePlayers = players.filter(p => p.character) as PlayerWithSpeed[];

  const count = activePlayers.length;
  if (count === 0) return [];

  // generate unique random numbers 1..count
  const availableNumbers = Array.from({ length: count }, (_, i) => i + 1);

  const shuffledNumbers = availableNumbers
    .map(n => ({ n, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.n);

  const playersWithSpeed: PlayerWithSpeed[] = activePlayers.map((p, i) => {
    const mvmtSpd = parseInt(p.character!.mvmt_spd || "0", 10);
    const uniqueRandom = shuffledNumbers[i];
    return { ...p, uniqueRandom, final_speed: mvmtSpd + uniqueRandom };
  });

  // sort descending by final_speed, tiebreaker = uniqueRandom descending
  playersWithSpeed.sort((a, b) =>
    b.final_speed !== a.final_speed
      ? b.final_speed - a.final_speed
      : b.uniqueRandom - a.uniqueRandom
  );

  return playersWithSpeed;
}
