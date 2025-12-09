'use client';

import React from 'react';

type CellType = 'empty' | 'obstruction' | 'objective' | Character;

interface Character {
  name: string;
  role: string;
  portrait?: string;
}

interface GridBoardProps {
  grid: CellType[][];
  teamA: (Character | null)[];
}

export default function GridBoard({ grid, teamA }: GridBoardProps) {
  return (
    <div className="grid grid-cols-8 gap-1 mt-4">
      {grid.map((row, y) =>
        row.map((cell, x) => {
          let bgClass = 'bg-gray-200';
          let content = '';

          if (cell === 'empty') {
            bgClass = 'bg-gray-200';
          } else if (cell === 'obstruction') {
            bgClass = 'bg-black text-white font-bold';
            content = 'X';
          } else if (cell === 'objective') {
            bgClass = 'bg-green-500 text-white font-bold';
            content = '🏆';
          } else if (typeof cell === 'object') {
            content = cell.name.slice(0, 3);
            bgClass = teamA.includes(cell) ? 'bg-blue-500 text-white font-bold' : 'bg-red-500 text-white font-bold';
          }

          return (
            <div
              key={`${x}-${y}`}
              className={`w-16 h-16 flex items-center justify-center border ${bgClass}`}
              title={typeof cell === 'object' ? cell.name : ''}
            >
              {content}
            </div>
          );
        })
      )}
    </div>
  );
}
