'use client';

import Link from 'next/link';

export default function MainMenu() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-12">⚔️ Main Menu</h1>
      
      <div className="flex flex-col gap-6">
        <Link
          href="/characters"
          className="text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
        >
          🧙‍♂️ Characters
        </Link>

        <Link
          href="/arena"
          className="text-center bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
        >
          🏟️ Arena
        </Link>
      </div>
    </div>
  );
}
