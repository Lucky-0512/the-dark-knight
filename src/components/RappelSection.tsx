"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";

const STORIES = [
  {
    id: "academic_debt",
    image: "/window_student.png",
    thought: "Every exam passed is a step closer to retiring them. But the weight of their sacrifices is heavier than any textbook.",
    label: "Sector_01 // The_Weight",
    color: "#eab308", // Gold
  },
  {
    id: "corporate_void",
    image: "/window_mirror.png",
    thought: "Staring at the glow of the screen at 3 AM. A million lines of code to build a life I don't even have time to live.",
    label: "Sector_02 // The_Grind",
    color: "#06b6d4", // Cyan
  },
  {
    id: "urban_solitude",
    image: "/gotham_youth_collective.png",
    thought: "Surrounded by millions, yet completely invisible. We are a generation connected by signals, but starving for touch.",
    label: "Sector_03 // The_Echo",
    color: "#a855f7", // Purple
  },
  {
    id: "hope_found",
    image: "/indian_child_origami.png",
    thought: "My father says the darkness is just a shadow looking for its shape. I found mine in a piece of folded paper. It looks like justice.",
    label: "Sector_04 // The_Spark",
    color: "#f43f5e", // Rose/Red
  }
];

export function RappelSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      
      // 1. Animate Window Frames
      gsap.utils.toArray(".window-frame").forEach((frame: any) => {
        gsap.fromTo(frame,
          { opacity: 0, scale: 0.9, y: 100, filter: "brightness(0) blur(20px)" },
          {
            opacity: 1, scale: 1, y: 0, filter: "brightness(1) blur(0px)",
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse" // Fades in on scroll down, fades out when scrolled past, reverse on scroll up
            }
          }
        );
      });

      // 2. Animate Narrative Text Blocks
      gsap.utils.toArray(".narrative-block").forEach((block: any, i: number) => {
        // Slide in from the side it's placed on
        const xOffset = i % 2 === 0 ? 50 : -50; 
        
        gsap.fromTo(block,
          { opacity: 0, x: xOffset },
          {
            opacity: 1, x: 0,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.2, // Text reveals slightly after the image
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      // 3. Animate Synapse Connectors (Draw as you scroll)
      gsap.utils.toArray(".synapse-path").forEach((path: any) => {
        gsap.fromTo(path,
          { strokeDashoffset: 130 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path.closest('svg'), // Start drawing when the SVG enters
              start: "top 50%", // Start drawing when the top of the SVG reaches the middle of the screen
              end: "bottom 50%", // Finish when the bottom reaches the middle
              scrub: true
            }
          }
        );
      });

      // 4. Center-Screen "Active/Connected" State (Glow & Elevate)
      gsap.utils.toArray(".story-node").forEach((node: any) => {
        const wrapper = node.querySelector(".window-wrapper");
        const glow = node.querySelector(".active-glow");

        // Elevate the card
        gsap.to(wrapper, {
          y: -20, 
          scale: 1.03,
          duration: 0.6, 
          ease: "back.out(1.5)", // Gives it a nice pop
          scrollTrigger: {
            trigger: node,
            start: "center 55%", // Triggers exactly when the synapse line hits it
            end: "center 45%",
            toggleActions: "play reverse play reverse"
          }
        });

        // Erupt background glow
        gsap.to(glow, {
          opacity: 0.5, 
          scale: 1.2,
          duration: 0.6, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "center 55%",
            end: "center 45%",
            toggleActions: "play reverse play reverse"
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="city-rappel-section relative w-full bg-black min-h-screen" ref={containerRef}>
      
      {/* 1. Tiling Building Background */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/building_facade.png')",
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          mixBlendMode: "luminosity"
        }}
      />
      
      {/* 2. Cyberpunk Scanline Overlay on the whole building */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20 z-0" />

      {/* 3. Top Blend from Vigil Section */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black via-black/80 to-transparent z-[30] pointer-events-none" />

      {/* 4. Sticky HUD Layer - Stays pinned in viewport natively */}
      <div className="sticky top-0 left-0 w-full h-screen z-10 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Reticle */}
        <div className="relative w-80 h-80 opacity-40">
          <div className="absolute inset-0 border border-cyan-500/20 rounded-full" />
          <div className="absolute inset-[-20px] border border-cyan-500/10 rounded-full" />
          <div className="absolute left-[-50vw] top-1/2 w-[200vw] h-[1px] bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
        
        {/* HUD Text Overlays */}
        <div className="absolute top-12 left-12 font-mono text-[9px] text-cyan-500/50 uppercase tracking-[0.4em] leading-loose">
          SYSTEM_DESCEND: ACTIVE<br/>
          COORD: 40.7128° N, 74.0060° W<br/>
          TARGET: MIDDLE_CLASS_SECTOR
        </div>
        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2">
          <div className="w-48 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
          <span className="font-mono text-[8px] text-cyan-500/30 uppercase tracking-widest">Scanning_Social_Pulse...</span>
        </div>
      </div>

      {/* 5. The Organic Content Flow */}
      {/* We use -mt-[100vh] to pull this content UP over the sticky HUD, so they overlap perfectly */}
      <div className="relative z-20 flex flex-col w-full px-6 sm:px-12 md:px-24 pt-[30vh] pb-[50vh] gap-[80vh] -mt-[100vh]">
        {STORIES.map((story, i) => (
          <div key={story.id} className="story-node w-full flex justify-center">
            
            {/* Row Layout alternating left/right */}
            <div className={`relative w-full max-w-7xl flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
              
              {/* DESKTOP SYNAPSE CONNECTOR */}
              {i < STORIES.length - 1 && (
                <svg 
                  className="synapse-svg hidden lg:block absolute top-[50%] left-0 w-full h-[calc(100%+80vh)] pointer-events-none z-0 opacity-60" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                >
                  <defs>
                     <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={story.color} stopOpacity="1" />
                        <stop offset="100%" stopColor={STORIES[i+1].color} stopOpacity="1" />
                     </linearGradient>
                  </defs>
                  <path 
                    className="synapse-path"
                    d={i % 2 === 0 
                       ? "M 25 0 C 25 50, 75 50, 75 100" 
                       : "M 75 0 C 75 50, 25 50, 25 100"
                    }
                    stroke={`url(#grad-${i})`}
                    strokeWidth="0.2"
                    fill="none"
                    strokeDasharray="130"
                    strokeDashoffset="130"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
                  />
                </svg>
              )}

              {/* MOBILE SYNAPSE CONNECTOR */}
              {i < STORIES.length - 1 && (
                <svg 
                  className="synapse-svg block lg:hidden absolute top-[50%] left-0 w-full h-[calc(100%+80vh)] pointer-events-none z-0 opacity-60" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                >
                  <defs>
                     <linearGradient id={`grad-mob-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={story.color} stopOpacity="1" />
                        <stop offset="100%" stopColor={STORIES[i+1].color} stopOpacity="1" />
                     </linearGradient>
                  </defs>
                  <path 
                    className="synapse-path"
                    d="M 50 0 L 50 100"
                    stroke={`url(#grad-mob-${i})`}
                    strokeWidth="0.5"
                    fill="none"
                    strokeDasharray="130"
                    strokeDashoffset="130"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
                  />
                </svg>
              )}

              {/* Image / Window Frame Wrapper (for active elevation) */}
              <div className="window-wrapper relative w-full lg:w-1/2 aspect-[4/3] z-10">
                {/* Background active glow that erupts behind the frame */}
                <div className="active-glow absolute inset-0 blur-[80px] opacity-0 z-0 rounded-full scale-90" style={{ backgroundColor: story.color }} />
                
                <div className="window-frame absolute inset-0 border-[1px] border-white/10 bg-black shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden rounded-sm group z-10">
                  {/* Inner edge glow */}
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 z-10 pointer-events-none" 
                    style={{ boxShadow: `inset 0 0 100px ${story.color}` }} 
                  />
                  
                  <img 
                    src={story.image} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 grayscale-[0.8] group-hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-100" 
                    alt={story.label}
                  />
                  
                  {/* Window Atmosphere */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay z-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />

                  {/* Cyberpunk Node Label inside the image */}
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-2 border border-white/5 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: story.color }} />
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                      Node // {story.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Narrative */}
              <div className="narrative-block w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
                <span 
                  className={`${cinzel.className} text-[11px] tracking-[0.6em] uppercase mb-6`} 
                  style={{ color: story.color }}
                >
                  {story.label}
                </span>
                
                <p className={`${caveat.className} text-3xl md:text-5xl lg:text-6xl text-neutral-200 leading-tight italic drop-shadow-2xl`}>
                  "{story.thought}"
                </p>
                
                <div className={`mt-10 flex items-center gap-4 opacity-40 ${i % 2 === 0 ? 'justify-start' : 'justify-end lg:justify-start'}`}>
                  <div className="h-[1px] w-12 bg-white/50" />
                  <span className="text-[9px] font-mono text-white/80 uppercase tracking-[0.3em]">Synapse_Connected</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 6. Bottom Blend to Next Section */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/80 to-transparent z-[30] pointer-events-none" />

    </div>
  );
}
