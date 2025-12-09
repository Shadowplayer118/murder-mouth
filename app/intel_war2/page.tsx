'use client';

import React, { useState, useEffect } from 'react';
// import Chessboard from './_components/Chessboard';
import CoordinateInfo from './_components/CoordinateInfo';

const Arena = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <CoordinateInfo />
    </div>
  );
};

export default Arena;
