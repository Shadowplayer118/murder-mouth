'use client';

import React, { useState, useEffect } from 'react';
import CharacterSelector from './CharacterSelector';
import StatsTable, { Stat } from './StatsTable';
import CharacterInfo from './CharacterInfo';
import BattleLog from './BattleLog';

interface Character {
  id: number;
  name: string;
  title: string;
  stats: { [key: string]: number };
  portrait: string;
  icon: string;
  lore: string;
  ability: string;
}

type ActionType = 'Int' | 'Per' | 'Def' | 'Spd' | 'Dmg' | 'Crit';

const Board = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const createDefaultStats = (char?: Character) => [
    { label: 'Health', value: 20 },
    { label: 'Int', value: char ? char.stats.Int : 0 },
    { label: 'Per', value: char ? char.stats.Per : 0 },
    { label: 'Def', value: char ? char.stats.Def : 0 },
    { label: 'Spd', value: char ? char.stats.Spd : 0 },
    { label: 'Dmg', value: char ? char.stats.Dmg : 0 }
  ];

  // ------------------ Player 1 ------------------
  const [selectedId1, setSelectedId1] = useState(0);
  const [name1, setName1] = useState('');
  const [title1, setTitle1] = useState('');
  const [stats1, setStats1] = useState<Stat[]>(createDefaultStats());
  const [icon1, setIcon1] = useState<string | null>(null);
  const [portrait1, setPortrait1] = useState<string | null>(null);
  const [lifelines1, setLifelines1] = useState(3);

  // ------------------ Player 2 ------------------
  const [selectedId2, setSelectedId2] = useState(0);
  const [name2, setName2] = useState('');
  const [title2, setTitle2] = useState('');
  const [stats2, setStats2] = useState<Stat[]>(createDefaultStats());
  const [icon2, setIcon2] = useState<string | null>(null);
  const [portrait2, setPortrait2] = useState<string | null>(null);
  const [lifelines2, setLifelines2] = useState(3);

  // ------------------ Battle Log ------------------
  const [log, setLog] = useState<string[]>([]);

  // ------------------ Downed Queue ------------------
  const [downedQueue, setDownedQueue] = useState<('p1' | 'p2')[]>([]);

  const [winner, setWinner] = useState<string | null>(null);


  useEffect(() => {
    fetch('/data/characters.json')
      .then((res) => res.json())
      .then((data) => setCharacters(data))
      .catch((err) => console.error('Failed to load characters:', err));
  }, []);

  const handleStatChange = (index: number, value: number, setStats: React.Dispatch<React.SetStateAction<Stat[]>>, stats: Stat[]) => {
    const newStats = [...stats];
    newStats[index].value = value;
    setStats(newStats);
  };

  const handleSelect = (
    charId: number,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setStats: React.Dispatch<React.SetStateAction<Stat[]>>,
    setIcon: React.Dispatch<React.SetStateAction<string | null>>,
    setPortrait: React.Dispatch<React.SetStateAction<string | null>>,
    setSelectedId: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const selected = characters.find((c) => c.id === charId);
    setSelectedId(charId);
    if (!selected) return;

    setName(selected.name);
    setTitle(selected.title);
    setStats(createDefaultStats(selected));
    setIcon(selected.icon);
    setPortrait(selected.portrait);
  };

  // ------------------ Battle Logic ------------------
  const actionWeights = (stats: Stat[]): { action: ActionType; weight: number }[] => [
    { action: 'Int', weight: stats[1].value },
    { action: 'Per', weight: stats[2].value },
    { action: 'Def', weight: stats[3].value },
    { action: 'Spd', weight: stats[4].value },
    { action: 'Dmg', weight: stats[5].value },
    { action: 'Crit', weight: 10 }
  ];

  const pickAction = (stats: Stat[]): ActionType => {
    const weighted = actionWeights(stats);
    const total = weighted.reduce((sum, w) => sum + w.weight, 0);
    const rand = Math.random() * total;
    let accum = 0;
    for (const w of weighted) {
      accum += w.weight;
      if (rand <= accum) return w.action;
    }
    return 'Crit';
  };

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

const handleDowned = (
  playerName: string,
  playerStats: Stat[],
  lifelines: number,
  opponentHP: number
): { revived: boolean; newHP: number; newLifelines: number } => {
  const dice = rollDice();
  let newHP = playerStats[0].value;
  let newLifelines = lifelines;
  let revived = false;

  if (dice <= 3) {
    // Successful revival
    revived = true;
    newHP = Math.max(1, opponentHP - 2);
    newLifelines = 3; // Reset lifelines after revival
    setLog((l) => [...l, `${playerName} rolled ${dice} and is revived with ${newHP} HP! Lifelines reset to 3.`]);
  } else if (dice <= 5) {
    newLifelines -= 1;
    setLog((l) => [...l, `${playerName} rolled ${dice} and loses 1 lifeline (remaining ${newLifelines})`]);
  } else {
    newLifelines -= 2;
    setLog((l) => [...l, `${playerName} rolled ${dice} and loses 2 lifelines (remaining ${newLifelines})`]);
  }

  return { revived, newHP, newLifelines };
};


  // ------------------ Battle ------------------
  const battle = () => {
    // Enqueue downed players instead of resolving immediately
    if (stats1[0].value <= 0 && stats2[0].value <= 0) {
      setLog((l) => [...l, 'Both players are down! Click the button to roll dice.']);
      setDownedQueue(['p1', 'p2']);
      return;
    }
    if (stats1[0].value <= 0) {
      setLog((l) => [...l, `${name1} is down! Click the button to roll dice.`]);
      setDownedQueue(['p1']);
      return;
    }
    if (stats2[0].value <= 0) {
      setLog((l) => [...l, `${name2} is down! Click the button to roll dice.`]);
      setDownedQueue(['p2']);
      return;
    }

    // Regular battle
    const action1 = pickAction(stats1);
    const action2 = pickAction(stats2);

    let newStats1 = [...stats1];
    let newStats2 = [...stats2];
    let eventLog = `${name1} chose ${action1}, ${name2} chose ${action2}. `;

    if (action1 === action2) {
      eventLog += 'They clash, nothing happens.';
    } else {
      const damageMap: Record<ActionType, Record<ActionType, [number, number]>> = {
        Int: { Int: [0,0], Per: [0, -2], Def: [-2, 0], Spd: [0, -2], Dmg: [-6, 0], Crit: [-8, 0] },
        Per: { Int: [-2, 0], Per: [0,0], Def: [-6, 0], Spd: [0, -2], Dmg: [0, -4], Crit: [0, -6] },
        Def: { Int: [0, -2], Per: [0, -6], Def: [0,0], Spd: [-1, 0], Dmg: [-2, 0], Crit: [-4, 0] },
        Spd: { Int: [-2, 0], Per: [-2, 0], Def: [0, -1], Spd: [0,0], Dmg: [0, -2], Crit: [0, -2] },
        Dmg: { Int: [0, -6], Per: [-4, 0], Def: [0, -2], Spd: [-2, 0], Dmg: [0,0], Crit: [-6, -4] },
        Crit: { Int: [0, -8], Per: [-6, 0], Def: [0, -4], Spd: [-2, 0], Dmg: [-4, -6], Crit: [0,0] },
      };

      const [dmgTo1, dmgTo2] = damageMap[action1][action2] || [0, 0];

      const excess1 = dmgTo1 < -newStats1[0].value ? -newStats1[0].value + dmgTo1 : 0;
      const excess2 = dmgTo2 < -newStats2[0].value ? -newStats2[0].value + dmgTo2 : 0;

      newStats1[0].value = Math.max(0, newStats1[0].value + dmgTo1);
      newStats2[0].value = Math.max(0, newStats2[0].value + dmgTo2);

      if (excess1) setLifelines1((l) => Math.max(0, l + excess1));
      if (excess2) setLifelines2((l) => Math.max(0, l + excess2));

      eventLog += `HP Change => ${name1}: ${newStats1[0].value}, ${name2}: ${newStats2[0].value}`;
    }

    setStats1(newStats1);
    setStats2(newStats2);
    setLog((l) => [...l, eventLog]);
  };

  // ------------------ Downed Click Handler ------------------
  const handleDownedClick = () => {
    if (downedQueue.length === 0) return;

    const current = downedQueue[0];
    const opponentHP = current === 'p1' ? stats2[0].value : stats1[0].value;

    const result = current === 'p1'
      ? handleDowned(name1, stats1, lifelines1, opponentHP)
      : handleDowned(name2, stats2, lifelines2, opponentHP);

    if (current === 'p1') {
      setStats1((prev) => [{ ...prev[0], value: result.newHP }, ...prev.slice(1)]);
      setLifelines1(result.newLifelines);
    } else {
      setStats2((prev) => [{ ...prev[0], value: result.newHP }, ...prev.slice(1)]);
      setLifelines2(result.newLifelines);
    }

    setDownedQueue((q) => q.slice(1));

    if (result.newLifelines <= 0) {
      const winner = current === 'p1' ? name2 : name1;
      setLog((l) => [...l, `${current === 'p1' ? name1 : name2} lost all lifelines! ${winner} wins!`]);
      setDownedQueue([]);
      setWinner(winner);
    }
  };

return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Fighting Game Layout: Players Face Each Other */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          
          {/* Player 1 - Left Side */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm rounded-lg border-2 border-blue-500/30 p-4 shadow-lg shadow-blue-500/20">
            <div className="text-blue-400 font-bold text-lg mb-3 text-center lg:text-left">PLAYER 1</div>
            <CharacterSelector
              characters={characters}
              selectedId={selectedId1}
              onSelect={(id) => handleSelect(id, setName1, setTitle1, setStats1, setIcon1, setPortrait1, setSelectedId1)}
            />
            <CharacterInfo
              name={name1}
              setName={setName1}
              title={title1}
              setTitle={setTitle1}
              health={stats1[0].value}
              setHealth={(val) => handleStatChange(0, val, setStats1, stats1)}
              portrait={portrait1}
              icon={icon1}
            />
            <StatsTable stats={stats1} onChange={(idx, val) => handleStatChange(idx, val, setStats1, stats1)} />
            <div className="mt-3 text-center text-blue-300 font-semibold bg-blue-950/50 rounded py-2">
              ❤️ Lifelines: {lifelines1}
            </div>
          </div>

          {/* Center - VS, Battle Log & Action Buttons */}
          <div className="flex flex-col items-center gap-4 order-first lg:order-none">
            <div className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse">
              VS
            </div>
            
            {/* Battle Log - Centered */}
            <div className="w-full">
              <BattleLog log={log} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={battle} 
                disabled={downedQueue.length > 0}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform transition hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
              >
                ⚔️ BATTLE
              </button>
              
              {downedQueue.length > 0 && (
                <button 
                  onClick={handleDownedClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95 animate-bounce"
                >
                  🎲 Roll for Recovery
                </button>
              )}
            </div>
          </div>

          {/* Player 2 - Right Side */}
          <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 backdrop-blur-sm rounded-lg border-2 border-red-500/30 p-4 shadow-lg shadow-red-500/20">
            <div className="text-red-400 font-bold text-lg mb-3 text-center lg:text-right">PLAYER 2</div>
            <CharacterSelector
              characters={characters}
              selectedId={selectedId2}
              onSelect={(id) => handleSelect(id, setName2, setTitle2, setStats2, setIcon2, setPortrait2, setSelectedId2)}
            />
            <CharacterInfo
              name={name2}
              setName={setName2}
              title={title2}
              setTitle={setTitle2}
              health={stats2[0].value}
              setHealth={(val) => handleStatChange(0, val, setStats2, stats2)}
              portrait={portrait2}
              icon={icon2}
            />
            <StatsTable stats={stats2} onChange={(idx, val) => handleStatChange(idx, val, setStats2, stats2)} />
            <div className="mt-3 text-center text-red-300 font-semibold bg-red-950/50 rounded py-2">
              ❤️ Lifelines: {lifelines2}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
