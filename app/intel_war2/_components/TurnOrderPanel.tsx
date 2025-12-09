'use client';

import React from 'react';

interface Character {
  name: string;
  role?: string;
  mvmt_spd?: string;
}

interface TurnCharacter extends Character {
  uniqueNum: number;
  finalSpeed: number;
}

interface TurnOrderPanelProps {
  turnOrder: TurnCharacter[];
}

export default function TurnOrderPanel({ turnOrder }: TurnOrderPanelProps) {
  return (
    <div className="mt-4 w-full max-w-md border p-2 rounded bg-gray-50">
      <h3 className="font-bold mb-2">Turn Order</h3>

      {turnOrder.length > 0 ? (
        <ol className="list-decimal list-inside">
          {turnOrder.map((c) => (
            <li key={c.name}>
              {c.name} ({c.role}) – Final Speed: {c.finalSpeed} [Base mvmt_spd: {c.mvmt_spd}, Unique #: {c.uniqueNum}]
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">No turn order calculated yet.</p>
      )}
    </div>
  );
}
