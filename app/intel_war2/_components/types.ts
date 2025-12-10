export type Player = {
  id: string;
  team: "X" | "Y";
  position?: [number, number];
  character?: CharacterData | null;
};

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
