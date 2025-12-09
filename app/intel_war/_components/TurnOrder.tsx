import React from "react";
import { TeamMember } from "./TeamContainer";

export type TurnOrderProps = {
  teamAMembers: (TeamMember | null)[];
  teamBMembers: (TeamMember | null)[];
};

export type PlayerTurn = TeamMember & {
  assignedNumber: number;
  totalSpeed: number;
};

export default function TurnOrder({ teamAMembers, teamBMembers }: TurnOrderProps) {
  const [turnOrder, setTurnOrder] = React.useState<PlayerTurn[]>([]);

  function generateTurnOrder() {
    const allPlayers = [...teamAMembers, ...teamBMembers].filter(Boolean) as TeamMember[];
    if (allPlayers.length === 0) return;

    // Generate unique numbers 1-10
    let numbers = Array.from({ length: allPlayers.length }, (_, i) => i + 1);
    numbers = numbers.sort(() => Math.random() - 0.5);

    const playersWithSpeed = allPlayers.map((player, i) => ({
      ...player,
      assignedNumber: numbers[i],
      totalSpeed: Number(player.mvmt_spd) + numbers[i],
    }));

    playersWithSpeed.sort((a, b) => b.totalSpeed - a.totalSpeed);
    setTurnOrder(playersWithSpeed);
  }

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <button
        className="mb-2 px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-400 active:scale-95 transition"
        onClick={generateTurnOrder}
      >
        ⚡ Generate Turn Order
      </button>

      {turnOrder.length > 0 && (
        <div className="bg-gray-800 p-3 rounded w-96">
          <h3 className="text-white font-bold mb-2">Turn Order</h3>
          <ol className="list-decimal list-inside text-white">
            {turnOrder.map((p, i) => (
              <li key={i}>
                {p.name} (mvmt_spd: {p.mvmt_spd}, number: {p.assignedNumber}) → Total: {p.totalSpeed}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
