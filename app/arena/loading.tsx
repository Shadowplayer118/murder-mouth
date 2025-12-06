'use client';

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/95 text-[#00ff99] font-mono text-3xl tracking-widest">
      <div className="animate-pulse drop-shadow-[0_0_10px_#00f5ff]">
        Decrypting{dots}
      </div>
    </div>
  );
}
