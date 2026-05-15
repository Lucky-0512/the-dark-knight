"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CityGrid } from "./CityGrid";

export function BatTransition() {
  const [phase, setPhase] = useState<"cowl" | "grid">("cowl");

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {phase === "cowl" ? (
          <motion.div 
            key="cowl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 5, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => setPhase("grid")}
          >
            {/* The Bat Cowl Eyes - Abstracted */}
            <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
               {/* Left Eye */}
               <motion.div 
                className="w-48 h-12 bg-white/5 border-t-2 border-white/20 -rotate-12 rounded-[50%_50%_0_0] blur-[1px] relative overflow-hidden"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
               </motion.div>
               
               {/* Gap */}
               <div className="w-32" />

               {/* Right Eye */}
               <motion.div 
                className="w-48 h-12 bg-white/5 border-t-2 border-white/20 rotate-12 rounded-[50%_50%_0_0] blur-[1px] relative overflow-hidden"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
               </motion.div>
            </div>

            <div className="mt-12 text-center">
              <span className="cinzel text-neutral-500 text-xs tracking-[0.5em] uppercase group-hover:text-white transition-colors duration-500">
                 [ Click to Initiate Detective Mode ]
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0"
          >
            <CityGrid />
            <button 
              onClick={() => setPhase("cowl")}
              className="absolute top-8 right-8 z-50 cinzel text-[8px] text-white/20 hover:text-white tracking-[0.5em] uppercase transition-colors"
            >
              Exit_Terminal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
