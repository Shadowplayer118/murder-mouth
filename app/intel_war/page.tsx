'use client';

import React, { useState, useEffect } from 'react';
import Chessboard from './_components/Chessboard';

const Arena = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <Chessboard />
    </div>
  );
};

export default Arena;
