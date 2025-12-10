// Character type for JSON data
export type CharacterData = {
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
  total: string;
  lore: string;
  ability: string;
  portrait: string;
  icon: string;
};

// Player on the grid
export type Player = {
  name: string;
  team: 'X' | 'Y';
  position: [number, number];
  character: CharacterData | null;
};

// Objective location
export type Objective = {
  position: [number, number];
};

// Turn order entry
export type TurnOrderEntry = {
  playerName: string;
  characterName: string;
  mvmt_spd: number;
  randomTieBreaker: number;
  totalSpeed: number;
};

// Movement logs
export type MovementLog = {
  turn: number;
  player: string;
  move: string;
  announcement?: string;
  newPos: [number, number];
};
