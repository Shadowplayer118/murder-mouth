'use client';

import React, { useState, useEffect } from 'react';
import CharacterSelector from './CharacterSelector';
import StatsTable, { Stat } from './StatsTable';
import CharacterInfo from './CharacterInfo';
import BattleLog from './BattleLog';
import DocumentationModal from './Documentation';

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
  const [docModalOpen, setDocModalOpen] = useState(false);


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
  const canAttemptRecovery = lifelines1 > 0 && lifelines2 > 0;



useEffect(() => {
  fetch('/data/characters.json')
    .then((res) => res.json())
    .then((data) => {
      // Map JSON to Character type
      const formatted: Character[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.title || '',
        stats: {
          Int: Number(c.Int || 0),
          Per: Number(c.Per || 0),
          Def: Number(c.Def || 0),
          Spd: Number(c.Spd || 0),
          Dmg: Number(c.Dmg || 0),
        },
        portrait: c.portrait || 'default.png',
        icon: c.icon || 'default.png',
        lore: c.lore || '',
        ability: c.ability || '',
      }));
      setCharacters(formatted);
    })
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
): { revived: boolean; newHP: number; newLifelines: number; roll: number } => {
  const dice = rollDice(); // get the dice roll
  let newHP = playerStats[0].value;
  let newLifelines = lifelines;
  let revived = false;

  if (dice <= 3) {
    // Successful revival
    revived = true;
    newHP = Math.max(1, opponentHP - 2);
    newLifelines = 3; // Reset lifelines after revival
  } else if (dice <= 5) {
    newLifelines -= 1;
  } else {
    newLifelines -= 2;
  }

  return { revived, newHP, newLifelines, roll: dice };
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

  const newQueue = [...downedQueue];
  const newStats1 = [...stats1];
  const newStats2 = [...stats2];
  let updatedLifelines1 = lifelines1;
  let updatedLifelines2 = lifelines2;
  let tempLog: string[] = [...log];
  let winner: string | null = null;

  while (newQueue.length > 0) {
    const current = newQueue.shift()!;
    const opponentHP = current === 'p1' ? newStats2[0].value : newStats1[0].value;

    const result =
      current === 'p1'
        ? handleDowned(name1, newStats1, updatedLifelines1, opponentHP)
        : handleDowned(name2, newStats2, updatedLifelines2, opponentHP);

    if (current === 'p1') {
      newStats1[0] = { ...newStats1[0], value: result.newHP };
      updatedLifelines1 = result.newLifelines;
    } else {
      newStats2[0] = { ...newStats2[0], value: result.newHP };
      updatedLifelines2 = result.newLifelines;
    }

    // Log the roll, status, and remaining lifelines
    tempLog.push(
      `${current === 'p1' ? name1 : name2} rolled ${result.roll} and ${
        result.revived ? 'got back up!' : 'stayed down.'
      } Remaining lifelines: ${result.newLifelines}`
    );
  }

  // Check for winner after resolving queue
  if (updatedLifelines1 <= 0 && updatedLifelines2 <= 0) {
    winner = 'Tie!';
    tempLog.push(`Both players lost all lifelines!`);
  } else if (updatedLifelines1 <= 0) {
    winner = name2;
    tempLog.push(`${name1} lost all lifelines! ${name2} wins!`);
  } else if (updatedLifelines2 <= 0) {
    winner = name1;
    tempLog.push(`${name2} lost all lifelines! ${name1} wins!`);
  }

  // Commit updates
  setStats1(newStats1);
  setStats2(newStats2);
  setLifelines1(updatedLifelines1);
  setLifelines2(updatedLifelines2);
  setLog(tempLog);
  setDownedQueue([]);
  setWinner(winner);
};



return (
  <div className="min-h-screen bg-black text-[#00ff99] font-mono p-2 sm:p-3">

        <div className="flex gap-2 mb-2">
      {/* Refresh Page */}
      <button
        onClick={() => window.location.reload()}
        className="uppercase border-2 border-[#00ff99] py-1 px-2 font-bold text-xs sm:text-sm tracking-widest hover:bg-[#004d2e] active:scale-95"
      >
        CLEAR SIMULATION
      </button>

      {/* Open Documentation Modal */}
      <button
        onClick={() => setDocModalOpen(true)}
        className="uppercase border-2 border-[#00ff99] py-1 px-2 font-bold text-xs sm:text-sm tracking-widest hover:bg-[#004d2e] active:scale-95"
      >
        Documentation
      </button>
    </div>


    {/* Mobile Portrait = 1 Col   →   Landscape / Tablet+ = 3 Col */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">

      {/* ===================== SUBJECT A ===================== */}
      <div className="border-2 border-[#00ff99] p-2 sm:p-3 space-y-2 sm:space-y-3">
        <h2 className="text-center text-[#00ffb3] font-bold 
                       text-base sm:text-xl tracking-widest border-b pb-1">
          SUBJECT-A
        </h2>

        <CharacterSelector
          characters={characters}
          selectedId={selectedId1}
          onSelect={(id)=>
            handleSelect(id, setName1, setTitle1, setStats1, setIcon1, setPortrait1, setSelectedId1)
          }
        />

        <CharacterInfo
          name={name1} setName={setName1}
          title={title1} setTitle={setTitle1}
          health={stats1[0].value}
          setHealth={(v)=>handleStatChange(0, v, setStats1, stats1)}
          portrait={portrait1} icon={icon1}
        />

        <StatsTable stats={stats1}
          onChange={(i,v)=>handleStatChange(i,v,setStats1,stats1)}
        />

        <div className="mt-2 border border-[#00ff99] p-1.5 text-xs sm:text-sm text-center tracking-wide">
          LIFELINES: {lifelines1}
        </div>
      </div>

      {/* ===================== SUBJECT B ===================== */}
      <div className="border-2 border-[#00ff99] p-2 sm:p-3 space-y-2 sm:space-y-3">
        <h2 className="text-center text-[#00ffb3] font-bold 
                       text-base sm:text-xl tracking-widest border-b pb-1">
          SUBJECT-B
        </h2>

        <CharacterSelector
          characters={characters}
          selectedId={selectedId2}
          onSelect={(id)=>
            handleSelect(id, setName2, setTitle2, setStats2, setIcon2, setPortrait2, setSelectedId2)
          }
        />

        <CharacterInfo
          name={name2} setName={setName2}
          title={title2} setTitle={setTitle2}
          health={stats2[0].value}
          setHealth={(v)=>handleStatChange(0, v, setStats2, stats2)}
          portrait={portrait2} icon={icon2}
        />

        <StatsTable stats={stats2}
          onChange={(i,v)=>handleStatChange(i,v,setStats2,stats2)}
        />

        <div className="mt-2 border border-[#00ff99] p-1.5 text-xs sm:text-sm text-center tracking-wide">
          LIFELINES: {lifelines2}
        </div>
      </div>

      {/* ================= SYSTEM LOG PANEL ================= */}
      <div className="border-2 border-[#00ff99] p-2 sm:p-3 flex flex-col gap-2">

        <h2 className="text-center border-b pb-1 font-bold tracking-widest text-sm sm:text-base">
          SYSTEM LOG FEED
        </h2>

        <button
          onClick={battle}
          disabled={downedQueue.length > 0}
          className="uppercase border-2 border-[#00ff99] py-2 sm:py-3 font-bold 
                     tracking-widest text-xs sm:text-sm 
                     hover:bg-[#004d2e] active:scale-95 disabled:opacity-25"
        >
          Execute Combat Protocol
        </button>

        {downedQueue.length > 0 && (
          <button
            onClick={() => {
              if (!canAttemptRecovery) {
                // Warning when trying to click while lifelines depleted
                setLog((l) => [...l, '☠ Signal Lost: cannot attempt recovery!']);
                return;
              }
              handleDownedClick();
            }}
            disabled={!canAttemptRecovery}
            className="uppercase border-2 border-[#00ff99] py-2 font-bold tracking-widest
                      text-xs sm:text-sm animate-pulse hover:bg-[#003d24] active:scale-95
                      disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Attempt Subject Recovery
          </button>
        )}

        <div className="flex-1 h-[45vh] sm:h-[65vh] overflow-y-auto p-2 
                        text-[#00ff95] text-xs sm:text-sm leading-tight">
          <BattleLog log={log} />
        </div>

      </div>

      <DocumentationModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />

    </div>
  </div>
);





};

export default Board;
