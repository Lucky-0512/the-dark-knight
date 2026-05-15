"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";

const MESSAGES = [
  { text: "To the youth fighting their own demons in the shadows of the city...", type: "normal" },
  { text: "You don't need to find a hero. You need to become the symbol.", type: "normal" },
  { text: "You need to turn your fear into your greatest weapon.", type: "normal" },
  { text: "\"The night is darkest just before the dawn. And the dawn is coming.\"", type: "italic" }
];

export function BubbleReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          refreshPriority: 52,
        }
      });

      // Sequence the messages
      bubblesRef.current.forEach((bubble, index) => {
        if (!bubble) return;
        
        tl.fromTo(bubble, 
          { opacity: 0, scale: 0.8, filter: "blur(20px)", y: 50 },
          { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 2 }
        )
        .to(bubble, {
          opacity: 0,
          scale: 1.2,
          filter: "blur(20px)",
          y: -100,
          duration: 2,
          delay: 1.5
        });
      });

      // Animate the background atmosphere
      gsap.to(".bg-orb", {
        y: "-200px",
        opacity: 0.1,
        stagger: {
          amount: 5,
          repeat: -1,
          from: "random"
        },
        duration: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative bg-black overflow-hidden bubble-reveal-container">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isMounted && Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-orb absolute w-4 h-4 rounded-full border border-cyan-500/20 bg-cyan-500/5 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* MESSAGES */}
      {MESSAGES.map((msg, i) => (
        <div
          key={i}
          ref={(el) => { bubblesRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 opacity-0"
        >
          <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center">
             {/* GOTHIC NARRATIVE FRAME */}
             <img 
               src="/bubble_gothic.jpeg" 
               alt="Narrative Perspective" 
               className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-60 filter grayscale brightness-125"
             />
             
             <div className="relative z-10 px-8 md:px-24 text-center max-w-[85%]">
               <p className={`
                 ${msg.type === 'italic' ? `${caveat.className} text-3xl md:text-5xl text-neutral-300 italic` : `${cinzel.className} text-xl md:text-3xl text-white font-light leading-relaxed tracking-widest`}
               `}>
                 {msg.text}
               </p>
             </div>
          </div>
        </div>
      ))}

      {/* SCROLL HINT */}
      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4 opacity-30 pointer-events-none">
        <span className={`${cinzel.className} text-[9px] tracking-[0.6em] text-white uppercase`}>Final Perspective // Archive_Entry</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/50 to-transparent" />
      </div>
    </div>
  );
}
