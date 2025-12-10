"use client";

import React from "react";
import { Player } from "./types";

interface Props {
  players: Player[];
  objective: [number, number] | null;
}

export default function BoardDisplay({ players, objective }: Props) {
  return (
    <div className="flex items-start gap-10 text-lg mt-6">

      {/* TEAM X */}
      <div>
        <h2 className="font-bold text-blue-400 mb-2">Team X</h2>
        {players
          .filter(p => p.team === "X" && p.character) // only show players with character
          .map(p => (
            <p key={p.id}>
              {p.character!.name} → ({p.position?.[0]}, {p.position?.[1]})
            </p>
          ))}
      </div>

      {/* TEAM Y */}
      <div>
        <h2 className="font-bold text-red-400 mb-2">Team Y</h2>
        {players
          .filter(p => p.team === "Y" && p.character) // only show players with character
          .map(p => (
            <p key={p.id}>
              {p.character!.name} → ({p.position?.[0]}, {p.position?.[1]})
            </p>
          ))}
      </div>

      {/* OBJECTIVE */}
      <div className="ml-10">
        <h2 className="font-bold text-green-400 mb-2">Objective</h2>
        <p className="font-bold">
          {objective ? `(${objective[0]}, ${objective[1]})` : "--"}
        </p>
      </div>

    </div>
  );
}
