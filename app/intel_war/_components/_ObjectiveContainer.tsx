import React from "react";

type ObjectiveContainerProps = {
  square: string | null;       // current position of ⭐
  onRegenerate: () => void;    // function that generates new square
};

export default function ObjectiveContainer({ square, onRegenerate }: ObjectiveContainerProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-2">

      <div className="text-lg font-semibold text-yellow-400">
        Objective Location: <span className="text-white">{square ?? "None"}</span>
      </div>

      <button
        onClick={onRegenerate}
        className="px-4 py-2 rounded bg-yellow-500 text-black font-bold 
                   hover:bg-yellow-400 active:scale-95 transition">
        🔄 Regenerate Objective
      </button>

    </div>
  );
}
