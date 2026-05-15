"use client";
import Spline from '@splinetool/react-spline';
import { useState } from 'react';

interface SplineModelProps {
  scene: string;
  onLoad?: () => void;
}

export default function SplineModel({ scene, onLoad }: SplineModelProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      )}
      <Spline 
        scene={scene} 
        onLoad={() => {
          setLoading(false);
          if (onLoad) onLoad();
        }}
      />
    </div>
  );
}
