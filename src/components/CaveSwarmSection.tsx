import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { ImageSequence } from "./ImageSequence";

export function CaveSwarmSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<any>(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the section for the cave climb
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 1,
        refreshPriority: 88,
        onUpdate: (self) => {
          // Drive the image sequence
          if (sequenceRef.current) {
            sequenceRef.current.setFrame(self.progress);
          }

          // Show text only when we exit the well (around 75% progress)
          if (self.progress > 0.75) {
            setShowText(true);
          } else {
            setShowText(false);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden cave-swarm-trigger">
      
      {/* The Swarm Sequence */}
      {/* TOP BLEND MASK - This removes the rigid line */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* BOTTOM BLEND MASK - This dissolves the cave floor */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      <div className="absolute inset-0 z-10 cinematic-blend">
        <ImageSequence 
          ref={sequenceRef}
          frameCount={240} 
          imagePathPrefix="/sequences/cave/ezgif-frame-"
          imageExtension=".webp"
          padding={3}
        />
      </div>

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      {/* The Reveal Text - Pulled down slightly for optical centering */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pt-24 px-8 text-center pointer-events-none">
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <h2 className={`${cinzelDeco.className} text-6xl md:text-9xl text-white mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] margin-top-40`}>
                THE CRUCIBLE
              </h2>
              <div className="space-y-8">
                <p className={`${caveat.className} text-3xl md:text-5xl text-neutral-300 font-light leading-relaxed reveal-smoke italic`}>
                   "Fear is not a weakness. It is the raw material of transformation. To conquer the city, you must first survive your own mind."
                </p>
                <div className="h-[1px] w-24 bg-white/20 mx-auto" />
                <p className={`${caveat.className} text-2xl md:text-4xl text-neutral-500 italic reveal-smoke`}>
                   In the abyss, you don't find darkness. You find the discipline required to master it.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scanline Detail */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
