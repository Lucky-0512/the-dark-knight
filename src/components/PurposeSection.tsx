"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import { ImageSequence, ImageSequenceHandle } from "./ImageSequence";

export function PurposeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<ImageSequenceHandle>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (!isMounted || !sectionRef.current || !containerRef.current) return;

    // PINNING & ANIMATION TIMELINE
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%", // Scroll for 3 screen heights
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 56,
          onUpdate: (self) => {
            if (sequenceRef.current) {
              sequenceRef.current.setFrame(self.progress);
            }
          }
        }
      });

      // HUD Rotation
      tl.to(".compass-hud", {
        rotate: 360,
        ease: "none"
      }, 0);

      // BEAT 1: THE REALIZATION
      tl.fromTo(".purpose-beat-1", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1 }, 0.1
      );
      tl.to(".purpose-beat-1", 
        { opacity: 0, y: -50, duration: 1 }, 0.8
      );

      // BEAT 2: THE ARCHITECTURE
      tl.fromTo(".purpose-beat-2", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1 }, 1.1
      );
      tl.to(".purpose-beat-2", 
        { opacity: 0, y: -50, duration: 1 }, 1.8
      );

      // BEAT 3: THE SIGNPOST
      tl.fromTo(".purpose-beat-3", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1 }, 2.1
      );
      tl.to(".purpose-beat-3", 
        { opacity: 0, y: -50, duration: 1 }, 2.8
      );

      // BEAT 4: THE NORTH
      tl.fromTo(".purpose-beat-4", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1 }, 3.1
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center z-[60]"
      id="purpose-section"
    >
      {isMounted && (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
          
          {/* BACKGROUND IMAGE SEQUENCE (THE COMPASS) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 z-0">
            <div className="w-full h-full max-w-5xl max-h-5xl opacity-60 filter grayscale brightness-50">
              <ImageSequence 
                ref={sequenceRef}
                frameCount={40} 
                imagePathPrefix="/symbol_sequence/ezgif-frame-"
                imageExtension=".webp"
                padding={3}
              />
            </div>
          </div>

          {/* HUD ELEMENTS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="compass-hud w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] border border-white/5 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 border-t-2 border-white/10 rounded-full animate-pulse" />
              <div className="w-[95%] h-[95%] border border-white/5 rounded-full" />
              
              {/* Coordinate Markers */}
              {[0, 90, 180, 270].map((deg) => (
                <div 
                  key={deg}
                  className="absolute h-full w-[2px] bg-gradient-to-b from-white/20 via-transparent to-transparent"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}
            </div>
          </div>

          {/* TEXT OVERLAYS */}
          <div className="relative z-20 w-full max-w-5xl px-8 text-center h-[50vh] flex items-center justify-center">
            
            {/* BEAT 1 */}
            <div className="purpose-beat-1 absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <span className={`${cinzel.className} text-[#a8c8e8] text-xs tracking-[1em] uppercase mb-8`}>
                The Realization
              </span>
              <h2 className={`${cinzelDeco.className} text-4xl md:text-7xl text-white tracking-widest leading-tight uppercase`}>
                Motivation is a <span className="text-[#a8c8e8] text-shadow-glow">Spark</span>. <br/>
                Inspiration is a <span className="text-[#a8c8e8] text-shadow-glow">Feeling</span>.
              </h2>
            </div>

            {/* BEAT 2 */}
            <div className="purpose-beat-2 absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <h2 className={`${cinzelDeco.className} text-4xl md:text-7xl text-white tracking-widest leading-tight uppercase`}>
                Sparks die without <br/>
                <span className="text-[#a8c8e8] text-shadow-glow">Architecture</span>.
              </h2>
              <p className={`${caveat.className} text-3xl md:text-4xl text-neutral-400 mt-12 max-w-2xl italic`}>
                "The night I understood that nobody was going to come... was the night I became dangerous."
              </p>
            </div>

            {/* BEAT 3 */}
            <div className="purpose-beat-3 absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <div className="w-24 h-[2px] bg-white/20 mb-10" />
              <h2 className={`${cinzelDeco.className} text-4xl md:text-7xl text-white tracking-[0.3em] uppercase`}>
                Fear is not a <br/>
                <span className="text-red-900 line-through decoration-red-600/50">Stop Sign</span>.
              </h2>
              <h2 className={`${cinzelDeco.className} text-5xl md:text-8xl text-[#a8c8e8] tracking-[0.4em] uppercase mt-6 text-shadow-glow`}>
                It is a Signpost.
              </h2>
            </div>

            {/* BEAT 4 */}
            <div className="purpose-beat-4 absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
              <span className={`${cinzel.className} text-white/40 text-xs tracking-[1.2em] uppercase mb-6`}>
                Phase 04: The Compass
              </span>
              <h2 className={`${cinzelDeco.className} text-6xl md:text-[10rem] text-white tracking-[0.5em] uppercase leading-none`}>
                FIND YOUR <br/>
                <span className="text-[#a8c8e8] text-shadow-glow">NORTH</span>
              </h2>
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="w-[1px] h-24 bg-gradient-to-b from-[#a8c8e8] to-transparent" />
                <span className={`${cinzel.className} text-sm text-[#a8c8e8]/80 tracking-[0.8em] animate-pulse uppercase`}>
                  ENTER THE VORTEX
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Atmospheric Blending */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />

      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 30px rgba(168, 200, 232, 0.4);
        }
      `}</style>
    </section>
  );
}
