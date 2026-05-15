"use client";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import { motion, AnimatePresence } from "framer-motion";

function Building({ position, index, onSelect }: { position: [number, number, number], index: number, onSelect: (index: number) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Organic floating movement
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      hovered ? 0.5 : 0,
      0.1
    );
    
    // Wireframe pulse
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <boxGeometry args={[0.8, Math.random() * 4 + 1, 0.8]} />
      <meshStandardMaterial 
        color={hovered ? "#06b6d4" : "#111"} 
        emissive={hovered ? "#06b6d4" : "#06b6d4"}
        emissiveIntensity={hovered ? 2 : 0.2}
        transparent
        opacity={0.8}
        wireframe
      />
    </mesh>
  );
}

export function CityGrid() {
  const [selected, setSelected] = useState<number | null>(null);

  const grid = useMemo(() => {
    const items = [];
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        items.push([x * 1.5, 0, z * 1.5] as [number, number, number]);
      }
    }
    return items;
  }, []);

  const STORIES = [
    { label: "Node_Dharma", thought: "Subject 04: The child in Sector 7 found a piece of the cowl. Bio-resonance: 94%. Hope detected." },
    { label: "Node_04", thought: "Subject 12: Engineering student. Third night without sleep. The city expects a machine, but the heart is still human." },
    { label: "Node_Collective", thought: "Sector 9: The youth are restless. They don't want a hero, they want a way out of the cycle." },
    { label: "Node_09", thought: "Terminal 44: A father working double shifts. The hope is fading, but the discipline remains unbroken." },
    { label: "Node_Scanner", thought: "System Alert: Collective anxiety reaching critical levels in the lower districts. Scanning for stabilizers." }
  ];

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
        
        <group rotation={[0, -Math.PI / 4, 0]}>
          {grid.map((pos, i) => (
            <Building 
              key={i} 
              position={pos} 
              index={i} 
              onSelect={(idx) => setSelected(idx % STORIES.length)} 
            />
          ))}
          
          {/* Holographic Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial 
              color="#06b6d4" 
              transparent 
              opacity={0.05} 
              wireframe 
            />
          </mesh>
        </group>

        {/* Basic emissive glow works well in R3F without extra post-processing libraries */}
      </Canvas>

      {/* Atmospheric Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-black/80 border border-cyan-500/30 p-10 font-mono shadow-[0_0_50px_rgba(6,182,212,0.2)]"
          >
            <div className={`${cinzel.className} text-cyan-500 text-[10px] uppercase tracking-[0.4em] mb-6 border-b border-cyan-500/20 pb-4 flex justify-between`}>
              <span>{STORIES[selected].label} // Scan_Result</span>
              <span className="animate-pulse">NODE_{selected}</span>
            </div>
            
            <p className={`${caveat.className} text-white text-2xl md:text-3xl leading-relaxed mb-8 italic`}>
              "{STORIES[selected].thought}"
            </p>
            
            <button 
              onClick={() => setSelected(null)}
              className={`w-full py-4 bg-cyan-500/5 hover:bg-cyan-500/15 text-cyan-500 text-[10px] uppercase tracking-[0.5em] border border-cyan-500/20 transition-all duration-500 ${cinzel.className}`}
            >
              Secure_Terminal
            </button>

            {/* Scanning Scanline in Modal */}
            <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 w-full h-[1px] bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 left-12 z-10 pointer-events-none">
         <div className={`${cinzel.className} text-cyan-500/40 text-[9px] tracking-[0.6em] uppercase flex flex-col gap-1`}>
            <span>Global_Metropolis_Grid</span>
            <div className="w-24 h-[1px] bg-cyan-500/20" />
            <span>Link_Stable: 99.8%</span>
         </div>
      </div>
    </div>
  );
}
