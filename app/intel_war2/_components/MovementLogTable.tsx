'use client';

import React from 'react';
import { MovementLog } from './types';

type MovementLogTableProps = {
  movementLogs: MovementLog[];
};

export default function MovementLogTable({ movementLogs }: MovementLogTableProps) {
  if (movementLogs.length === 0) return null;

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Movement Log:</h2>
      <table className="min-w-full border border-gray-600 text-white">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2">Turn</th>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2">Move</th>
            <th className="px-4 py-2">New Position</th>
            <th className="px-4 py-2">Announcement</th>
          </tr>
        </thead>
        <tbody>
          {movementLogs.map((log, idx) => (
            <tr key={idx} className="border-b border-gray-700">
              <td className="px-4 py-2">{log.turn}</td>
              <td className="px-4 py-2">{log.player}</td>
              <td className="px-4 py-2">{log.move}</td>
              <td className="px-4 py-2">[{log.newPos[0]}, {log.newPos[1]}]</td>
              <td className="px-4 py-2">{log.announcement || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
