"use client";

import React from "react";
import { PlayerWithSpeed } from "./utils/calculateTurnOrder";

interface Props {
  turnOrder: PlayerWithSpeed[];
  currentTurnIndex?: number;
}

export default function TurnOrderDisplay({ turnOrder, currentTurnIndex = 0 }: Props) {
  if (turnOrder.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-purple-400 mb-2">Turn Order</h2>
      <ol className="list-decimal ml-6">
        {turnOrder.map((p, idx) => (
          <li
            key={p.id}
            className={idx === currentTurnIndex ? "text-yellow-400 font-bold" : ""}
          >
            {p.character!.name} (Final Speed: {p.final_speed}, Unique: {p.uniqueRandom})
          </li>
        ))}
      </ol>
    </div>
  );
}
