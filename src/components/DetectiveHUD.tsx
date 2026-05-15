"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HOTSPOTS = [
  { id: 1, x: "25%", y: "40%", issue: "Academic Pressure", diagnostic: "Cortisol levels critical. Subject internalizing failure.", note: "They are chasing a grade, not a life." },
  { id: 2, x: "65%", y: "30%", issue: "Societal Isolation", diagnostic: "Loneliness detected in high-density area.", note: "Millions of people, but no one is seen." },
  { id: 3, x: "45%", y: "70%", issue: "Burnout", diagnostic: "Physical fatigue at 92%. Sleep deprivation confirmed.", note: "They run until they break. This isn't discipline." },
  { id: 4, x: "80%", y: "55%", issue: "Loss of Purpose", diagnostic: "Apathy detected. Purpose link severed.", note: "They have the tools, but they've lost the target." },
];

export function DetectiveHUD() {
  const [activeHotspot, setActiveHotspot] = useState<typeof HOTSPOTS[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050505] overflow-hidden cursor-none group">
      {/* The City Map - Styled for Detective Mode */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://images.unsplash.com/photo-1570160230261-bcac51fe83ad?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale contrast-200 brightness-50" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Global Blue/Cyan Tint Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay bg-cyan-900/20" />

      {/* Spotlight / Mask Effect */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`
        }}
      />

      {/* Targeting Reticle */}
      <motion.div 
        className="fixed w-24 h-24 border border-cyan-500/50 z-50 pointer-events-none flex items-center justify-center rounded-sm"
        animate={{ 
          left: mousePos.x, 
          top: mousePos.y,
          x: "-50%",
          y: "-50%",
          rotate: isScanning ? 90 : 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.5 }}
      >
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-400" />
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-400" />
        
        {/* Reticle Data Lines */}
        <div className="absolute -right-32 top-0 w-24 h-[1px] bg-cyan-500/30" />
        <div className="absolute -right-32 top-0 text-[10px] text-cyan-500/60 font-mono tracking-tighter uppercase pl-2">
          SCANNING_NODE_{Math.floor(mousePos.x)}
        </div>
      </motion.div>

      {/* Hotspots (The Windows) */}
      {HOTSPOTS.map((spot) => (
        <div
          key={spot.id}
          className="absolute z-40"
          style={{ left: spot.x, top: spot.y }}
          onMouseEnter={() => {
            setActiveHotspot(spot);
            setIsScanning(true);
          }}
          onMouseLeave={() => {
            setActiveHotspot(null);
            setIsScanning(false);
          }}
        >
          <div className="relative">
            {/* The lit window effect */}
            <div className="w-4 h-6 bg-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.5)] cursor-pointer hover:scale-150 transition-transform duration-300" />
            
            <AnimatePresence>
              {activeHotspot?.id === spot.id && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 40 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-0 left-full ml-4 w-64 bg-black/80 backdrop-blur-md border border-cyan-500/30 p-4 font-mono z-50 pointer-events-none"
                >
                  <div className="text-cyan-400 text-xs mb-1 uppercase tracking-widest border-b border-cyan-500/20 pb-1 flex justify-between">
                    <span>Scan Result</span>
                    <span className="animate-pulse">● LIVE</span>
                  </div>
                  <div className="text-white text-sm font-bold mb-2 uppercase">{spot.issue}</div>
                  <div className="text-cyan-500/80 text-[10px] leading-tight mb-3">
                    {spot.diagnostic}
                  </div>
                  <div className="text-yellow-500/60 text-[10px] italic leading-tight border-t border-white/10 pt-2">
                    &gt; BAT_NOTE: "{spot.note}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* HUD Border UI */}
      <div className="absolute inset-8 border border-white/5 pointer-events-none z-40">
         <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
            Detective Mode // v4.2<br/>
            Frequency: 2.4Ghz [Locked]
         </div>
         <div className="absolute bottom-0 right-0 p-4 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] text-right">
            Coordinates: 19.0760 N, 72.8777 E<br/>
            BATT: 84% [Stable]
         </div>
      </div>
    </div>
  );
}
