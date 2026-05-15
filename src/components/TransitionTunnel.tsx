"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  {
    id: "01",
    title: "THE DESCENT",
    desc: "Conquering the fear of the dark.",
    meta: "LOG_ID: WAYNE_WELL_08",
    color: "#ffffff"
  },
  {
    id: "02",
    title: "THE DISCIPLINE",
    desc: "Mastery of the mind and body.",
    meta: "LOG_ID: TRAINING_ARCHIVE_12",
    color: "#eab308"
  },
  {
    id: "03",
    title: "THE MASK",
    desc: "Becoming a symbol of justice.",
    meta: "LOG_ID: COWL_SYNTAX_01",
    color: "#ffffff"
  },
  {
    id: "04",
    title: "THE CHAOS",
    desc: "Standing against the madness.",
    meta: "LOG_ID: J_FILE_RED_ACTUAL",
    color: "#39FF14"
  }
];

export function HistoryTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    let ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray(".history-node");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // Animate each node to fly toward the camera
      nodes.forEach((node: any, i) => {
        tl.fromTo(node, 
          { 
            z: -5000, 
            opacity: 0, 
            scale: 0.1 
          },
          { 
            z: 1000, 
            opacity: 1, 
            scale: 2,
            duration: 2,
            ease: "power2.inOut"
          },
          i * 1.5 // staggered start
        )
        .to(node, {
          opacity: 0,
          scale: 5,
          z: 2000,
          duration: 1,
          ease: "power2.in"
        }, "-=0.5");
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full h-screen overflow-hidden perspective-1000">
      
      {/* TUNNEL BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black z-20" />
        
        {/* Rotating UI Rings (Digital Compass) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] opacity-10">
          <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
          <div className="absolute inset-20 border border-white/5 rounded-full animate-reverse-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute inset-40 border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '40s' }} />
        </div>

        {/* Floating Data Bits */}
        {isMounted && (
          <div className="absolute inset-0 z-10 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center transform-style-3d">
        {NODES.map((node, i) => (
          <div 
            key={i} 
            className="history-node absolute w-[90vw] md:w-[600px] h-[400px] flex items-center justify-center pointer-events-none opacity-0"
          >
             {/* THE NODE FRAME */}
             <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="relative w-full h-full border border-white/10 bg-white/[0.02] backdrop-blur-md p-10 flex flex-col justify-between group pointer-events-auto cursor-crosshair transition-all duration-500"
             >
                {/* Biometric Pulse Indicator */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/40 group-hover:border-yellow-500 transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/40 group-hover:border-yellow-500 transition-colors" />

                {/* HUD DECORATIONS */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="w-1.5 h-1.5 bg-white/40 group-hover:bg-yellow-500 animate-pulse" />
                   <div className="w-12 h-[1px] bg-white/20 mt-1" />
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] cinzel text-white/20 tracking-widest group-hover:text-yellow-500/40">
                   {node.meta}
                </div>

                {/* CONTENT */}
                <div className="space-y-4">
                   <span className="cinzel text-xs tracking-[0.5em] text-white/40 block mb-2 group-hover:text-yellow-500/60">NODE_{node.id}</span>
                   <h3 className="cinzel text-4xl md:text-6xl text-white tracking-widest uppercase transition-colors" style={{ color: node.color }}>
                      {node.title}
                   </h3>
                   <div className="w-12 h-[1px] bg-white/20 group-hover:w-full transition-all duration-700" />
                   <p className="text-neutral-500 text-lg md:text-xl font-light italic max-w-sm group-hover:text-neutral-300">
                      "{node.desc}"
                   </p>
                </div>

                <div className="flex justify-between items-end">
                   <div className="text-[8px] cinzel text-white/10 flex flex-col group-hover:text-white/30">
                      <span>STABILITY: NOMINAL</span>
                      <span>SYNC_STATUS: 100%</span>
                   </div>
                   <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-yellow-500/50">
                      <div className="w-1 h-1 bg-white/40 group-hover:bg-yellow-500" />
                   </div>
                </div>

                {/* SCANLINE OVERLAY */}
                <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px]" />
             </motion.div>
          </div>
        ))}

        {/* FINAL VOW TRIGGER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
           {/* We will add the Symbol and One Rule here at the end of the tunnel timeline */}
        </motion.div>
      </div>
    </div>
  );
}
