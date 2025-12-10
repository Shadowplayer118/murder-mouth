"use client";

import React, { useState, useEffect } from "react";
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
  const [log, setLog] = useState<string[]>([]);

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
    // generate new turn order
    const newTurnOrder = calculateTurnOrder(players);
    setTurnOrder(newTurnOrder);
    setCurrentTurnIndex(0);
    setLog(prev => [...prev, "--- New Turn Order Generated ---"]);
    return;
  }

  const activePlayer = turnOrder[currentTurnIndex];
  if (!activePlayer.character) return;

  const action = Math.random() < 0.5 ? "move" : "view";

  let logEntry = "";
  let found = false;

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
        if (occupyingPlayer.team === activePlayer.team) {
          logEntry = `Regrouped with ${occupyingPlayer.character?.name ?? occupyingPlayer.id}`;
        } else {
          logEntry = `Engaging enemy at (${coord[0]}, ${coord[1]})`;
        }
        found = true; // stop after first encounter
        break;
      } else if (objective && coord[0] === objective[0] && coord[1] === objective[1]) {
        logEntry = `${activePlayer.character.name} → Objective Secured!`;
        setPlayers(prev =>
          prev.map(p =>
            p.id === activePlayer.id ? { ...p, position: [...objective] } : p
          )
        );
        const { objective: newObjective } = startGameRandomizer(players);
        setObjective(newObjective);
        found = true;
        break;
      } else {
        // move freely
        setPlayers(prev =>
          prev.map(p =>
            p.id === activePlayer.id ? { ...p, position: coord } : p
          )
        );
        logEntry = `${activePlayer.character.name} moved to (${coord[0]}, ${coord[1]})`;
        found = true;
        break;
      }
    } else if (action === "view") {
      const foundPlayer = players.find(
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
    // report nothing after 5 unsuccessful tries
    if (action === "move") {
      logEntry = `${activePlayer.character.name} → Could not move after searching 5 locations.`;
    } else {
      logEntry = `${activePlayer.character.name} → Nothing found after scanning 5 locations.`;
    }
  }

  setLog(prev => [...prev, logEntry]);

  // move to next player
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
          const { players: newPlayers, objective: obj } = startGameRandomizer(players);
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

      <TurnOrderDisplay turnOrder={turnOrder} currentTurnIndex={currentTurnIndex} />
      <BoardDisplay players={players} objective={objective} />

      {/* Log display */}
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
