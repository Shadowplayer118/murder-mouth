'use client';

import React, { useState, useEffect } from 'react';
import Board from './_components/Board';
import LoadingScreen from '../components/LoadingScreen'; // import the loading screen

const Arena = () => {
  const [loading, setLoading] = useState(true);

  // simulate async loading, or you can tie this to real fetch/data
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s fake load
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen h-screen w-full bg-black">
      <Board />
    </div>
  );
};

export default Arena;
