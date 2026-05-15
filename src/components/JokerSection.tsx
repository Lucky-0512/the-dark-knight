"use client";
import React, { useRef } from "react";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const SYMBOLS = ["HA", "HA", "HA", "HE", "WHY?", "SMILE", "HA"];
const JOKER_COLORS = ["#8b5cf6", "#22c55e", "#facc15", "#ef4444"]; // Purple, Green, Yellow, Red

export function JokerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Acid leak expansion based on scroll
  const leakScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1.5]);
  const leakOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0]);
  const glitchX = useTransform(scrollYProgress, [0.4, 0.45, 0.5, 0.55, 0.6], [0, -10, 20, -5, 0]);

  const smoothOpacity = useSpring(leakOpacity, { stiffness: 100, damping: 30 });
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="min-h-[250vh] relative overflow-hidden flex items-center justify-center py-32 bg-black z-30 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] cursor-none joker-trigger"
    >
      {/* CUSTOM JOKER CURSOR */}
      <motion.div 
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          x: { type: "spring", damping: 20, stiffness: 300, mass: 0.5 },
          y: { type: "spring", damping: 20, stiffness: 300, mass: 0.5 },
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 3, repeat: Infinity }
        }}
        className="fixed top-0 left-0 w-10 h-10 z-[100] pointer-events-none text-[#39FF14] drop-shadow-[0_0_10px_#39FF14]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 50 Q 50 90 90 50 Q 50 60 10 50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M20 40 L30 30 M70 40 L80 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* THE ACID LEAK (Background Glows) */}
      <motion.div 
        style={{ 
          scale: leakScale,
          opacity: smoothOpacity 
        }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#39FF14]/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#9D00FF]/15 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-transparent to-black z-10" />
      </motion.div>

      {/* HA HA SWARM & CARDS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {isMounted && (
          <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 select-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
                animate={{ 
                  x: [null, `${(Math.random() - 0.5) * 100}%`],
                  y: [null, `${(Math.random() - 0.5) * 100}%`],
                  rotate: [null, Math.random() * 360]
                }}
                transition={{ duration: 15 + Math.random() * 25, repeat: Infinity, ease: "linear" }}
                className={`absolute ${caveat.className} font-bold text-2xl md:text-6xl mix-blend-screen opacity-40`}
                style={{ color: JOKER_COLORS[i % JOKER_COLORS.length] }}
              >
                {SYMBOLS[i % SYMBOLS.length]}
              </motion.div>
            ))}
          </div>

          {/* THE 3D CARD CASCADE (Chaos Rain) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 perspective-[2000px]">
            {Array.from({ length: 24 }).map((_, i) => {
              // Create unique characteristics for each card
              const initialX = Math.random() * 100;
              const delay = Math.random() * 5;
              const duration = 12 + Math.random() * 10;
              const hasText = Math.random() > 0.5;
              const text = Math.random() > 0.5 ? "HA" : "WHY?";
              
              return (
                <motion.div
                  key={`card-cascade-${i}`}
                  initial={{ 
                    x: `${initialX}%`, 
                    y: "-20%", 
                    z: Math.random() * 1000 - 500,
                    rotateX: Math.random() * 360,
                    rotateY: Math.random() * 360,
                    rotateZ: Math.random() * 360 
                  }}
                  animate={{ 
                    y: "120%",
                    rotateX: [0, 720],
                    rotateY: [0, 360],
                    rotateZ: [0, 180]
                  }}
                  transition={{ 
                    duration: duration, 
                    repeat: Infinity, 
                    delay: delay,
                    ease: "linear" 
                  }}
                  style={{
                    filter: `blur(${Math.abs(Math.random() * 4)}px)`, // Simple depth of field
                  }}
                  className="absolute w-20 h-32 md:w-28 md:h-40 bg-neutral-950 border border-[#39FF14]/30 rounded-md flex flex-col items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.1)] backdrop-blur-sm"
                >
                  {/* Card Interior */}
                  <div className="absolute top-2 left-2 text-[10px] text-[#39FF14]/40 cinzel">J</div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-[#39FF14]/40 cinzel rotate-180">J</div>
                  
                  {hasText ? (
                    <span className={`${caveat.className} text-3xl md:text-5xl text-[#39FF14]/80 -rotate-12`}>
                      {text}
                    </span>
                  ) : (
                    <div className="w-12 h-16 border border-[#39FF14]/20 rounded-sm flex items-center justify-center">
                       <div className="w-6 h-6 bg-[#39FF14]/10 rounded-full animate-pulse" />
                    </div>
                  )}

                  {/* Scuffs and Grime Overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#39FF14]/10" />
                </motion.div>
              );
            })}
          </div>

          {/* FLICKERING "WHY SO SERIOUS" */}
          <motion.div 
            animate={{ opacity: [0, 0.05, 0, 0.1, 0] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.15, 0.2, 1] }}
            className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 ${cinzelDeco.className} text-[20vw] text-[#9D00FF] uppercase opacity-5`}
          >
            WHY SO SERIOUS?
          </motion.div>

          {/* INSANITY EMOJI SWARM */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
             {Array.from({ length: 30 }).map((_, i) => (
               <motion.div
                 key={`emoji-${i}`}
                 initial={{ 
                   x: `${Math.random() * 100}%`, 
                   y: `${Math.random() * 100}%`,
                   scale: Math.random() * 2 + 0.5,
                   rotate: Math.random() * 360
                 }}
                 animate={{ 
                   x: [null, `${(Math.random() - 0.5) * 120}%`],
                   y: [null, `${(Math.random() - 0.5) * 120}%`],
                   rotate: [null, Math.random() * 720]
                 }}
                 transition={{ 
                   duration: 20 + Math.random() * 40, 
                   repeat: Infinity, 
                   ease: "linear" 
                 }}
                 className="absolute text-4xl filter sepia(1) saturate(10) hue-rotate(80deg) brightness(1.5)"
               >
                 {SYMBOLS[i % SYMBOLS.length]}
               </motion.div>
             ))}
          </div>
        </>
      )}
      </div>

      {/* THE INNER CHAOS CONTENT */}
      <div className="relative z-10 text-center max-w-5xl px-8">
        <motion.div
          style={{ x: glitchX }}
          className="space-y-12"
        >
          <div className="relative inline-block">
             <h2 className={`${cinzelDeco.className} text-6xl md:text-9xl text-white tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]`}>
                The Fever <br/>
                <span className="text-[#39FF14] italic">Within</span>
             </h2>
             {/* Glitch Overlay */}
             <motion.h2 
               animate={{ opacity: [0, 0.5, 0], x: [-2, 2, -2] }}
               transition={{ repeat: Infinity, duration: 0.2 }}
               className={`absolute inset-0 ${cinzelDeco.className} text-6xl md:text-9xl text-[#9D00FF] tracking-tighter uppercase opacity-30 select-none translate-x-1`}
             >
                The Fever <br/>
                Within
             </motion.h2>
          </div>

          <div className="space-y-8">
            <p className={`${caveat.className} text-2xl md:text-4xl text-neutral-400 italic max-w-3xl mx-auto leading-relaxed`}>
              "They tell you the system is sacred. That the plan will protect you in this concrete jungle."
            </p>
            
            <motion.div 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              className="p-8 border border-[#39FF14]/20 bg-white/[0.02] backdrop-blur-sm relative group overflow-hidden"
            >
              {/* Toxic Drip */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent shadow-[0_0_15px_#39FF14]" />
              
              <p className={`${cinzel.className} text-xl md:text-2xl text-[#39FF14] uppercase tracking-[0.3em] font-normal mb-4 group-hover:tracking-[0.5em] transition-all duration-700`}>
                The Joker's Joke:
              </p>
              <p className={`${caveat.className} text-neutral-300 text-2xl md:text-4xl font-light leading-relaxed italic`}>
                "In a sea of a billion people, it only takes one spark to turn a crowd into a tide of chaos. Your discipline is the only thing keeping the madness at bay. Don't let it leak."
              </p>

              {/* Decorative Scanlines for this section */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(57,255,20,0.1)_50%,transparent_50%)] bg-[length:100%_4px]" />
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12 pt-12 relative">
               {/* CHAOTIC BUTTONS */}
               <motion.button
                 whileHover={{ 
                    x: (Math.random() - 0.5) * 400, 
                    y: (Math.random() - 0.5) * 400,
                    rotate: (Math.random() - 0.5) * 40
                 }}
                 className={`px-8 py-3 border border-[#39FF14] text-[#39FF14] ${cinzel.className} text-sm tracking-widest uppercase hover:bg-[#39FF14] hover:text-black transition-colors duration-300`}
               >
                 Don't Click Me
               </motion.button>

               <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] cinzel text-[#39FF14]/40 uppercase tracking-[0.4em]">Chaos_Index</span>
                  <div className="w-40 h-[2px] bg-neutral-900 overflow-hidden relative">
                     <motion.div 
                       animate={{ 
                         width: ["10%", "95%", "20%", "100%", "50%"],
                         left: ["0%", "5%", "0%", "10%", "0%"]
                       }}
                       transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                       className="h-full bg-[#39FF14] shadow-[0_0_15px_#39FF14]"
                     />
                  </div>
               </div>

               <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] cinzel text-[#9D00FF]/40 uppercase tracking-[0.4em]">Sanity_Void</span>
                  <div className="w-40 h-[2px] bg-neutral-900 overflow-hidden relative">
                     <motion.div 
                       animate={{ 
                         width: ["100%", "5%", "80%", "0%", "30%"],
                         right: ["0%", "5%", "0%", "10%", "0%"]
                       }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                       className="h-full bg-[#9D00FF] shadow-[0_0_15px_#9D00FF]"
                     />
                  </div>
               </div>

               {/* EVADING EMOJI REPLACED WITH HE */}
               <motion.div
                 animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                 }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className={`${caveat.className} text-4xl text-purple-500 font-black hover:text-green-500 transition-all cursor-pointer`}
               >
                 HE
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edge Distortion (Vignette) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(57,255,20,0.15)] z-20" />
    </section>
  );
}
