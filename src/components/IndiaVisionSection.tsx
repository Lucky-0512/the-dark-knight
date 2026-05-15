"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import Image from "next/image";

export function IndiaVisionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const childY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const gridOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0, 0.8, 0]);

  // Coordinates data mimicking the "Detective Vision" global grid
  const cities = [
    { name: "MUMBAI", coords: "18.9220° N, 72.8347° E", top: "40%", left: "20%", delay: 0 },
    { name: "NEW DELHI", coords: "28.6139° N, 77.2090° E", top: "25%", left: "60%", delay: 0.2 },
    { name: "BENGALURU", coords: "12.9716° N, 77.5946° E", top: "70%", left: "45%", delay: 0.4 },
    { name: "VARANASI", coords: "25.3176° N, 82.9739° E", top: "35%", left: "80%", delay: 0.6 }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[150vh] bg-[#00050b] overflow-hidden flex items-center justify-center py-32 border-t border-b border-[#a8c8e8]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BACKGROUND GRID (Detective Vision) */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <div className="w-full h-full bg-[linear-gradient(rgba(168,200,232,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,200,232,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </motion.div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a8c8e8]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* LEFT COLUMN: THE CHILD ORIGAMI */}
        <motion.div 
          style={{ y: childY }}
          className="flex-1 relative aspect-[3/4] max-w-md w-full rounded-sm overflow-hidden"
        >
          {/* Subtle noise overlay over the image */}
          <div className="absolute inset-0 z-10 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
          
          <div className="w-full h-full relative">
            <Image 
              src={`https://pub-2773ce4c8a7943ae910bea9bf075b720.r2.dev/indian_child_origami.png`} 
              alt="The Promise" 
              fill 
              className="object-cover filter sepia-[0.3] hue-rotate-[180deg] saturate-50 brightness-75"
            />
          </div>

          {/* Glitch Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-gradient-to-t from-transparent via-[#a8c8e8] to-transparent mix-blend-screen"
                style={{
                  backgroundSize: '100% 4px',
                  backgroundImage: 'linear-gradient(to bottom, rgba(168,200,232,0.4) 50%, transparent 50%)'
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT COLUMN: TEXT & DATA */}
        <div className="flex-1 flex flex-col items-start text-left relative z-30 space-y-12">
          
          {/* HEADER */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-[#a8c8e8] animate-pulse" />
              <span className={`${cinzel.className} text-[#a8c8e8]/60 text-xs tracking-[0.8em] uppercase`}>
                Global Vigil
              </span>
              <div className="w-16 h-[1px] bg-[#a8c8e8]/30" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 1 }}
              className={`${cinzelDeco.className} text-5xl md:text-7xl text-white tracking-widest uppercase leading-tight`}
            >
              Batman <br/>
              <span className="text-[#a8c8e8]">x India</span>
            </motion.h2>
          </div>

          {/* PARAGRAPH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 1 }}
            className="pl-6 border-l-2 border-[#a8c8e8]/20"
          >
            <p className={`${caveat.className} text-2xl md:text-3xl text-neutral-400 font-light leading-relaxed italic max-w-lg`}>
              "The promise wasn't made to a single city. It was made to the innocent. Wherever the darkness is thickest, the signal finds its mark. The legend crosses borders."
            </p>
          </motion.div>

          {/* DATA POINTS (CITIES) */}
          <div className="w-full relative h-32 mt-8">
            <motion.div 
              style={{ opacity: gridOpacity }}
              className="absolute inset-0"
            >
              {cities.map((city, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: city.delay, duration: 0.8 }}
                  className="absolute flex flex-col items-start gap-1 group"
                  style={{ top: city.top, left: city.left }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a8c8e8] group-hover:shadow-[0_0_10px_#a8c8e8] transition-shadow" />
                  <span className={`${cinzel.className} text-[#a8c8e8]/80 text-[10px] tracking-widest uppercase`}>
                    {city.name}
                  </span>
                  <span className={`font-mono text-neutral-600 text-[8px] tracking-widest`}>
                    {city.coords}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
