"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinzel } from "@/lib/fonts";

const CHAPTERS = [
  { id: "section-0", name: "00. THE PROMISE", trigger: ".section-0" },
  { id: "section-1", name: "01. THE DESCENT", trigger: ".section-1" },
  { id: "bridge", name: "02. THE FALL", trigger: ".bridge-master-container" },
  { id: "cave", name: "03. THE CRUCIBLE", trigger: ".cave-swarm-trigger" },
  { id: "theater", name: "04. THE THEATER", trigger: ".theater-trigger" },
  { id: "mask", name: "05. THE MASK", trigger: ".cowl-trigger" },
  { id: "vigil", name: "06. THE VIGIL", trigger: ".vigil-section" },
  { id: "city", name: "07. THE CITY", trigger: ".city-rappel-section" },
  { id: "demons", name: "08. THE DEMONS", trigger: ".joker-trigger" },
  { id: "tunnel", name: "09. THE ARCHIVE", trigger: ".history-tunnel-trigger" },
  { id: "bubble", name: "10. THE CALL", trigger: ".bubble-reveal-trigger" },
  { id: "vow", name: "11. THE VOW", trigger: ".vow-section" },
  { id: "arrival", name: "12. THE ARRIVAL", trigger: ".arrival-trigger" },
];

export default function ChapterProgress() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Give components time to calculate their pinned heights
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    const triggers = CHAPTERS.map((chapter, index) => {
      return ScrollTrigger.create({
        trigger: chapter.trigger,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActiveChapter(index);
        },
      });
    });

    return () => {
      clearTimeout(refreshTimer);
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end gap-6 pointer-events-none">
      {CHAPTERS.map((chapter, index) => (
        <div 
          key={chapter.id}
          className="flex items-center gap-4 group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setHoveredChapter(index)}
          onMouseLeave={() => setHoveredChapter(null)}
          onClick={() => {
            const trigger = document.querySelector(chapter.trigger);
            if (trigger) {
              trigger.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {/* CHAPTER NAME (Fades in on hover or when active) */}
          <AnimatePresence>
            {(activeChapter === index || hoveredChapter === index) && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`${cinzel.className} text-[10px] tracking-[0.3em] text-white/60 whitespace-nowrap uppercase hidden md:block`}
              >
                {chapter.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* DOT INDICATOR */}
          <div className="relative flex items-center justify-center w-4 h-4">
            <motion.div 
              animate={{ 
                scale: activeChapter === index ? 1.5 : 1,
                backgroundColor: activeChapter === index ? "#22d3ee" : "rgba(255,255,255,0.2)",
                boxShadow: activeChapter === index ? "0 0 15px #22d3ee" : "none"
              }}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            />
            
            {/* ACTIVE RING */}
            {activeChapter === index && (
              <motion.div 
                layoutId="active-ring"
                className="absolute inset-0 border border-cyan-500/40 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </div>
      ))}

      {/* CONNECTING LINE */}
      <div className="absolute right-[7px] top-0 bottom-0 w-[1px] bg-white/5 -z-10" />
    </div>
  );
}
