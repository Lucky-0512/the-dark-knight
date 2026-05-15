"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cinzel, Caveat } from 'next/font/google';

gsap.registerPlugin(ScrollTrigger);

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

const SENTENCES = [
  "The loneliness at 3AM.",
  "The weight of a path no one else understands.",
  "The rage of potential — trapped.",
  "The exhaustion of fighting demons no one else can see."
];

export default function PsycheSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const cards = gsap.utils.toArray(".psyche-card");
    const totalCards = cards.length;

    // Create a master timeline pinned to the container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalCards * 100}%`, // 100vh of scrolling per card
        scrub: 1,
        pin: true,
        refreshPriority: 94, // Ensure it plays nicely with other pinned sections
      }
    });

    cards.forEach((card: any, i) => {
      // The first card is already on screen, so we only animate the others IN
      if (i > 0) {
        // Bring the new card up from the bottom
        tl.fromTo(card, 
          { y: "150vh", scale: 1.1, rotationX: 10, opacity: 0 }, 
          { y: 0, scale: 1, rotationX: 0, opacity: 1, ease: "power2.out", duration: 1 }, 
          i 
        );

        // Simultaneously push all previously stacked cards further back
        cards.slice(0, i).forEach((prevCard: any, j) => {
          const depth = i - j; 
          
          // Fade the card container itself
          tl.to(prevCard, {
            scale: 1 - (depth * 0.08), 
            y: -(depth * 60), 
            opacity: 0.3, // Make them significantly more transparent so they don't distract
            filter: `brightness(${1 - (depth * 0.4)}) blur(${depth * 4}px)`, 
            ease: "power2.out",
            duration: 1
          }, i);

          // CRITICAL: Fade out the actual text of previous cards so they don't overlap with the current one
          const prevText = prevCard.querySelector('.psyche-card-text');
          if (prevText) {
            tl.to(prevText, {
              opacity: 0,
              filter: "blur(10px)",
              duration: 0.5
            }, i);
          }
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      {/* Card Stack Container */}
      <div className="relative w-full max-w-5xl h-[50vh] sm:h-[60vh] md:h-[450px] flex items-center justify-center perspective-[2000px] z-10">
        
        {SENTENCES.map((sentence, i) => (
          <div 
            key={i} 
            className="psyche-card absolute w-[90%] md:w-full h-full rounded-2xl md:rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-neutral-900/95 to-black/95 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.15),inset_0_0_60px_rgba(6,182,212,0.05)] flex flex-col justify-between overflow-hidden"
            style={{ zIndex: SENTENCES.length - i }}
          >
            {/* Top HUD Bar */}
            <div className="w-full flex justify-between items-center px-8 py-5 border-b border-white/10 bg-black/60">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse" />
                <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-cyan-400/60 uppercase">
                  Memory Shard // {String(i + 1).padStart(3, '0')}
                </span>
              </div>
              <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-red-500/70 uppercase border border-red-500/30 px-3 py-1.5 rounded-md bg-red-500/5">
                Status: Fragmented
              </span>
            </div>

            {/* Core Text */}
            <div className="flex-1 flex items-center justify-center p-10 md:p-20">
              <p className={`psyche-card-text ${cinzel.className} text-2xl md:text-4xl lg:text-5xl text-white text-center tracking-[0.25em] leading-relaxed uppercase drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-700`}>
                "{sentence}"
              </p>
            </div>

            {/* Bottom Tech Details */}
            <div className="w-full flex justify-between items-center px-8 py-5 border-t border-white/10 bg-black/60">
              <div className="flex gap-2">
                {[...Array(6)].map((_, barIdx) => (
                  <div key={barIdx} className="w-1.5 h-4 bg-cyan-500/40 rounded-full" />
                ))}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-[8px] tracking-[0.4em] text-cyan-400/30 uppercase">
                  Neural Extraction
                </span>
                <span className="font-mono text-[10px] tracking-[0.5em] text-white/10 uppercase">
                  Complete
                </span>
              </div>
            </div>

            {/* Premium Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          </div>
        ))}

      </div>

    </section>
  );
}
