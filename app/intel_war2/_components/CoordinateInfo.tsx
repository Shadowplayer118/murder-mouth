"use client";

import React, { useState, useEffect, JSX} from "react";
import { startGameRandomizer } from "./utils/startGame";
import { Player, CharacterData } from "./types";
import BoardDisplay from "./BoardDisplay";
import CharacterSelect from "./CharacterSelect";
import { calculateTurnOrder, PlayerWithSpeed } from "./utils/calculateTurnOrder";
import TurnOrderDisplay from "./TurnOrderDisplay";


export default function CoordinateInfo() {
  const [characterList, setCharacterList] = useState<CharacterData[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [objective, setObjective] = useState<[number, number] | null>(null);
  const [turnOrder, setTurnOrder] = useState<PlayerWithSpeed[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);

  // 🔥 CHANGE 1: log now stores JSX elements
  const [log, setLog] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetch("/data/characters.json")
      .then(res => res.json())
      .then(data => setCharacterList(Array.isArray(data) ? data : [data]));

    const initialPlayers: Player[] = [
      { id: "x1", team: "X", character: null },
      { id: "x2", team: "X", character: null },
      { id: "x3", team: "X", character: null },
      { id: "x4", team: "X", character: null },
      { id: "x5", team: "X", character: null },
      { id: "y1", team: "Y", character: null },
      { id: "y2", team: "Y", character: null },
      { id: "y3", team: "Y", character: null },
      { id: "y4", team: "Y", character: null },
      { id: "y5", team: "Y", character: null },
    ];

    setPlayers(initialPlayers);
  }, []);

  const assignCharacter = (playerId: string, character: CharacterData) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, character } : p))
    );
  };

  const handleAction = () => {
    if (turnOrder.length === 0 || currentTurnIndex >= turnOrder.length) {
      const newTurnOrder = calculateTurnOrder(players);
      setTurnOrder(newTurnOrder);
      setCurrentTurnIndex(0);

      // 🔥 CHANGE 2: Use JSX log entry
      setLog(prev => [
        ...prev,
        <div className="text-yellow-300 font-bold" key={prev.length}>
          --- New Turn Order Generated ---
        </div>
      ]);
      return;
    }

    const activePlayer = turnOrder[currentTurnIndex];
    if (!activePlayer.character) return;

    const actorName = activePlayer.character.name;
    const actorImg = activePlayer.character.portrait || "default.png";

    const action = Math.random() < 0.5 ? "move" : "view";

    let logEntry: JSX.Element = <></>; // JSX instead of string
    let found = false;

    // 🔥 CHANGE 3: makeLog returns a JSX block with an <img>
// Updated makeLog
const makeLog = (msg: string, playerTeam: "X" | "Y" = activePlayer.team): JSX.Element => (
  <div key={Math.random()} className="flex items-center gap-2">
    <img
      src={`/images/${actorImg}`}
      alt={actorName}
      className="w-6 h-6 rounded border border-gray-600"
    />
    <span
      className={`font-bold ${playerTeam === "X" ? "text-blue-400" : "text-red-400"}`}
    >
      {actorName}:
    </span>
    <span>{msg}</span>
  </div>
);

    for (let attempt = 1; attempt <= 5; attempt++) {
      const coord: [number, number] = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8)
      ];

      if (action === "move") {
        const occupyingPlayer = players.find(
          p => p.position?.[0] === coord[0] && p.position?.[1] === coord[1]
        );

        if (occupyingPlayer) {
          logEntry = makeLog(
            occupyingPlayer.team === activePlayer.team
              ? `Regrouped with ${occupyingPlayer.character?.name ?? occupyingPlayer.id} [${coord[0]},${coord[1]}]`
              : `I've made contact with the enemy [${coord[0]},${coord[1]}]`
          );
          found = true;
          break;
        }

        if (objective && coord[0] === objective[0] && coord[1] === objective[1]) {
          logEntry = makeLog(`Objective secured [${coord[0]},${coord[1]}]`);

          setPlayers(prev =>
            prev.map(p =>
              p.id === activePlayer.id ? { ...p, position: [...objective] } : p
            )
          );

          const { objective: newObjective } = startGameRandomizer(players);
          setObjective(newObjective);

          found = true;
          break;
        }

        setPlayers(prev =>
          prev.map(p =>
            p.id === activePlayer.id ? { ...p, position: coord } : p
          )
        );

        logEntry = makeLog(`I'm moving out [${coord[0]},${coord[1]}]`);
        found = true;
        break;

      } else if (action === "view") {
        const foundPlayer = players.find(
          p => p.position?.[0] === coord[0] && p.position?.[1] === coord[1]
        );

        if (objective && coord[0] === objective[0] && coord[1] === objective[1]) {
          logEntry = makeLog(`Objective spotted at [${coord[0]},${coord[1]}]`);
          found = true;
          break;
        }

        if (foundPlayer) {
          logEntry = makeLog(
            foundPlayer.team === activePlayer.team
              ? `You're all clear ${foundPlayer.character?.name ?? foundPlayer.id} [${coord[0]},${coord[1]}]`
              : `Enemy spotted at [${coord[0]},${coord[1]}]`
          );
          found = true;
          break;
        }
      }
    }

    if (!found) {
      logEntry = makeLog(
        action === "move"
          ? `I'm moving out (no viable tiles)`
          : `I got nothing`
      );
    }

    // 🔥 JSX added to log
    setLog(prev => [...prev, logEntry]);

    setCurrentTurnIndex(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center p-6 text-white bg-gray-900 min-h-screen">
      <CharacterSelect
        players={players}
        characterList={characterList}
        onSelect={assignCharacter}
      />

      <button
        onClick={() => {
          const { players: newPlayers, objective: obj } =
            startGameRandomizer(players);
          setPlayers(newPlayers);
          setObjective(obj);
        }}
        className="px-4 py-2 mt-6 text-black bg-yellow-400 font-bold rounded-lg hover:bg-yellow-300"
      >
        PLAY
      </button>

      <button
        onClick={handleAction}
        className="px-4 py-2 mt-4 text-black bg-green-400 font-bold rounded-lg hover:bg-green-300"
      >
        ACTION → Next Turn
      </button>

      <TurnOrderDisplay
        turnOrder={turnOrder}
        currentTurnIndex={currentTurnIndex}
      />
      <BoardDisplay players={players} objective={objective} />

      {/* 🔥 Logs now show images */}
      <div className="mt-6 w-full max-w-xl bg-gray-800 p-4 rounded-lg overflow-y-auto h-64">
        <h2 className="text-lg font-bold text-white mb-2">Action Log</h2>
        <div className="text-sm text-gray-200 space-y-1">
          {log.map((entry, idx) => (
            <div key={idx}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
