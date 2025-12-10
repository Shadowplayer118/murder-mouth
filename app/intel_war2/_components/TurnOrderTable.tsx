'use client';

import React from 'react';
import { TurnOrderEntry } from './types';

type TurnOrderTableProps = {
  turnOrder: TurnOrderEntry[];
  currentTurnIndex: number;
};

export default function TurnOrderTable({ turnOrder, currentTurnIndex }: TurnOrderTableProps) {
  if (turnOrder.length === 0) return null;

  return (
    <table className="min-w-full border border-gray-600 text-white mb-4">
      <thead>
        <tr className="border-b border-gray-600">
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Player</th>
          <th className="px-4 py-2">Character</th>
          <th className="px-4 py-2">Base Speed</th>
          <th className="px-4 py-2">Random Tie-Breaker</th>
          <th className="px-4 py-2">Total Speed</th>
        </tr>
      </thead>
      <tbody>
        {turnOrder.map((entry, index) => (
          <tr
            key={entry.playerName}
            className={`border-b border-gray-700 ${currentTurnIndex === index ? 'bg-yellow-600' : ''}`}
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{entry.playerName}</td>
            <td className="px-4 py-2">{entry.characterName}</td>
            <td className="px-4 py-2">{entry.mvmt_spd}</td>
            <td className="px-4 py-2">{entry.randomTieBreaker}</td>
            <td className="px-4 py-2">{entry.totalSpeed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
