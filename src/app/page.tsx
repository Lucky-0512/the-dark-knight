"use client";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";


import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import dynamic from 'next/dynamic';
import { Experience } from "@/components/Experience";
import { ImageSequence, ImageSequenceHandle } from "@/components/ImageSequence";
import { RappelSection } from "@/components/RappelSection";
import { CaveSwarmSection } from "@/components/CaveSwarmSection";
import { IndiaVisionSection } from "@/components/IndiaVisionSection";
import { JokerSection } from "@/components/JokerSection";
import { PurposeSection } from "@/components/PurposeSection";
import { HistoryTunnel } from "@/components/HistoryTunnel";
import { BubbleReveal } from "@/components/BubbleReveal";
import SplineCardModel from "@/components/SplineCardModel";
import PsycheSection from "@/components/PsycheSection";
import { AudioEngine } from "@/components/AudioEngine";
import { X, ChevronRight } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTraining, setActiveTraining] = useState(0);
  const [trainingTextProgress, setTrainingTextProgress] = useState(0);
  const [cowlProgress, setCowlProgress] = useState(0);
  const [batProgress, setBatProgress] = useState(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const totalAssets = 9; // 4 Image Sequences + 5 Spline Models
  const isSiteLoaded = loadedCount >= totalAssets;
  const progress = Math.min(100, Math.floor((loadedCount / totalAssets) * 100));

  const handleAssetLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1);
  }, []);

  const batSequenceRef = useRef<ImageSequenceHandle>(null);
  const neuralSequenceRef = useRef<ImageSequenceHandle>(null);
  const cowlSequenceRef = useRef<ImageSequenceHandle>(null);
  const symbolSequenceRef = useRef<ImageSequenceHandle>(null);
  const vigilSequenceRef = useRef<ImageSequenceHandle>(null);
  const [vigilProgress, setVigilProgress] = useState(0);


  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Standard reveal animations for text
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");

      sections.forEach((section) => {
        const textElements = section.querySelectorAll(".reveal-text");
        if (textElements.length > 0) {
          gsap.fromTo(textElements,
            { y: 50, opacity: 0, filter: "blur(10px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.5,
              stagger: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "bottom top",
                toggleActions: "play none none reverse",
              }
            }
          );
        }
      });

      // Section 0: THE PROMISE
      const ch0Tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-0",
          start: "top top",
          end: "+=350%", // Tightened from 600% for better narrative flow
          scrub: 1,
          pin: true,
          refreshPriority: 100,
        }
      });

      const promiseLines = [".ch0-text-1", ".ch0-text-2", ".ch0-text-3", ".ch0-text-4"];

      promiseLines.forEach((line) => {
        ch0Tl.fromTo(line,
          { autoAlpha: 0, y: 20, filter: "blur(15px)", scale: 0.95 },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 3 }
        )
          // Reduced hold pause to make it snappier
          .to(line, { autoAlpha: 0, y: -20, filter: "blur(15px)", scale: 1.05, duration: 2 }, "+=2");
      });

      ch0Tl.fromTo(".section-0",
        { autoAlpha: 1, filter: "blur(0px)" },
        { autoAlpha: 0, filter: "blur(20px)", duration: 4 },
        "+=1"
      );

      // Fade out the initial hint as soon as we start scrolling
      ch0Tl.to(".section-0-hint", { opacity: 0, duration: 1 }, 0);

      // Section 1: THE NEURAL DESCENT
      const proxy = { frame: 0 };
      const ch1Tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-1",
          start: "top top",
          end: "+=800%", // Tightened from 1500% to keep user engaged
          scrub: 0.5,
          pin: true,
          refreshPriority: 95,
        }
      });

      // Phase 1: The Dot
      ch1Tl.to({}, { duration: 1 }) // Smaller dead zone
        .fromTo(".hero-dot",
          { scale: 1, autoAlpha: 1, filter: "blur(0px)" },
          { scale: 100, autoAlpha: 0, filter: "blur(30px)", duration: 6 } // Faster dot pop
        )
        .fromTo(".hero-scroll-hint",
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -20, duration: 2 },
          "-=5"
        )
        .fromTo(".neural-container",
          { autoAlpha: 0 },
          { autoAlpha: 0.6, duration: 4 },
          "-=3"
        )
        // Synchronized Sequence: The images play IN THE BACKGROUND alongside Phase 2
        .to(proxy, {
          frame: 1,
          duration: 100, // Restored back to 100 since we moved the sentences to a new section
          onUpdate: () => {
            if (neuralSequenceRef.current) {
              neuralSequenceRef.current.setFrame(Math.max(0, Math.min(1, proxy.frame)));
            }
          }
        }, "-=4")

        // Phase 2: GOTHAM Reveal
        // Adjusted timing to find the sweet spot: Catching the cowl as it reaches its peak
        .fromTo(".ch1-main-word",
          { autoAlpha: 0, letterSpacing: "1em", filter: "blur(30px)", scale: 1.1 },
          { autoAlpha: 1, letterSpacing: "0.05em", filter: "blur(0px)", scale: 1, duration: 15 },
          "<+26" // Shifted from +12 to +26 to delay it just enough
        )
        .fromTo(".ch1-subtitle",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 8 },
          "-=3"
        );

      // Fade out "GOTHAM isn't a city" and fade in the final quote at the center
      ch1Tl.to(".ch1-main-word", { autoAlpha: 0, y: -50, filter: "blur(20px)", duration: 8 }, "+=40") // Extended hold
        .to(".ch1-subtitle", { autoAlpha: 0, y: -20, filter: "blur(10px)", duration: 8 }, "<")
        .fromTo(".ch1-quote",
          { autoAlpha: 0, filter: "blur(20px)", scale: 0.95 },
          { autoAlpha: 1, filter: "blur(0px)", scale: 1, duration: 15 },
          "<+2"
        )
        // THE FINAL HOLD: Ensure the quote stays on screen for a long duration before the unpin
        .to({}, { duration: 80 });


      // Section 1.5: THE MASTER BRIDGE (Unified Sequence)
      const bridgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".bridge-master-container",
          start: "top top",
          end: "+=1200%", // Long enough to breathe but much faster than before
          scrub: 1,
          pin: true,
          refreshPriority: 90,
        }
      });

      // Beat 1: The Child
      bridgeTl.fromTo(".bridge-text-1",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", stagger: 1, duration: 3 }
      )
        .to(".bridge-text-1", { opacity: 0, y: -30, filter: "blur(10px)", duration: 2, delay: 2 })

        // Beat 2: The Fall
        .fromTo(".bridge-text-2",
          { opacity: 0, scale: 0.8, filter: "blur(15px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", stagger: 1, duration: 3 }
        )
        .to(".bridge-text-2", { opacity: 0, scale: 1.2, filter: "blur(15px)", duration: 2, delay: 2 })

        // Beat 3: The Purpose
        .fromTo(".bridge-text-3",
          { opacity: 0, y: 50, filter: "blur(20px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", stagger: 1, duration: 3 }
        )
        .to(".bridge-text-3", { opacity: 0, y: -100, filter: "blur(20px)", duration: 2, delay: 3 });

      // Section 8: THE VOW (Scrubbed Climax)
      const vowTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vow-section",
          start: "top top",
          end: "+=250%", // Snappier
          scrub: 1,
          pin: true,
          refreshPriority: 48,
        }
      });

      vowTl.fromTo(".vow-title",
        { opacity: 0, scale: 0.9, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2 }
      )
        .fromTo(".vow-quote",
          { opacity: 0, y: 20, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 2 },
          "-=1"
        )
        .fromTo(".vow-button-wrap",
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(".vow-footer",
          { opacity: 0, y: 10 },
          { opacity: 0.5, y: 0, stagger: 0.2, duration: 1 },
          "-=0.5"
        );

      // Section 3: Gotham Theater — Pinned scroll-driven 3D reveal
      if (trainingRef.current) {
        const totalStages = 5;
        ScrollTrigger.create({
          trigger: trainingRef.current,
          start: "top top",
          end: "+=3000vh", // 600vh per discipline = Significant hold time for immersion
          scrub: 1,
          pin: true,
          refreshPriority: 70,
          onUpdate: (self) => {
            const p = self.progress;
            const stageFloat = p * totalStages;
            const stageIndex = Math.min(Math.floor(stageFloat), totalStages - 1);
            const stageProgress = stageFloat - stageIndex;
            setActiveTraining(stageIndex);
            setTrainingTextProgress(stageProgress);
          }
        });
      }

      // Section 4 Pinning — with progress tracking for reveal
      gsap.timeline({
        scrollTrigger: {
          trigger: ".cowl-section",
          start: "top top",
          end: "+=400%",
          scrub: 1,
          pin: true,
          refreshPriority: 65,
          onUpdate: (self) => {
            cowlSequenceRef.current?.setFrame(self.progress);
            setCowlProgress(self.progress);
          }
        }
      });

      // Section 4.5: THE VIGIL — scroll-scrubbed video bridge
      ScrollTrigger.create({
        trigger: ".vigil-section",
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 0.5,
        refreshPriority: 60,
        onUpdate: (self) => {
          vigilSequenceRef.current?.setFrame(self.progress);
          setVigilProgress(self.progress);
        }
      });

      // Section 8 Pinning
      gsap.timeline({
        scrollTrigger: {
          trigger: ".symbol-section",
          start: "top top",
          end: "+=400%",
          scrub: 1,
          pin: true,
          refreshPriority: 47,
          onUpdate: (self) => symbolSequenceRef.current?.setFrame(self.progress)
        }
      });

      // Section 10: The Arrival (Bat Sequence Reveal)
      gsap.timeline({
        scrollTrigger: {
          trigger: ".arrival-section",
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          refreshPriority: 40,
          onUpdate: (self) => {
            batSequenceRef.current?.setFrame(self.progress);
            setBatProgress(self.progress);
          }
        }
      });

      // Global Smoke Reveal Observer
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.reveal-smoke').forEach(el => observer.observe(el));

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);

      return () => {
        clearTimeout(refreshTimeout);
        observer.disconnect();
      };
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isSiteLoaded && (
          <motion.div
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden mb-8">
              <motion.div
                className="absolute top-0 left-0 h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className={`${cinzel.className} text-yellow-500/50 tracking-[0.5em] text-xs uppercase animate-pulse font-normal`}>
              INITIALIZING BATCOMPUTER... {progress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative w-full bg-transparent ${isSiteLoaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'}`} style={{ transition: 'opacity 1.5s ease-in-out' }}>
        <main ref={containerRef} className="relative w-full overflow-hidden bg-transparent">
          <Experience />

          {/* SECTION 0: THE PROMISE */}
          <section className="min-h-screen h-screen w-full flex flex-col items-center justify-center text-center px-4 relative section-0 z-20 overflow-hidden bg-transparent">
            {/* ATMOSPHERIC GLOW FOR DEPTH */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

            <div className="section-0-content w-full max-w-4xl relative z-10 h-full">
              {/* METADATA OVERLAY */}
              <div className="absolute top-12 left-0 w-full flex justify-between px-4 md:px-12 opacity-30 pointer-events-none">
                <div className={`${cinzel.className} text-[9px] tracking-[0.5em] text-white uppercase`}>
                  Archive_ID: WAYNE_00 | Status: DECRYPTING...
                </div>
                <div className={`${cinzel.className} text-[9px] tracking-[0.5em] text-white uppercase text-right`}>
                  Chapter_00 | The_Promise
                </div>
              </div>

              {/* THE 4 LINES SEQUENCE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`ch0-text-1 absolute ${caveat.className} text-2xl md:text-4xl text-neutral-300 italic invisible`}>
                  "The world has a version of success it wants from you."
                </p>
                <p className={`ch0-text-2 absolute ${caveat.className} text-2xl md:text-4xl text-neutral-300 italic invisible`}>
                  "You've felt, for a long time, that it's the wrong one."
                </p>
                <p className={`ch0-text-3 absolute ${caveat.className} text-2xl md:text-4xl text-neutral-300 italic invisible`}>
                  "That feeling — the one you can't explain to anyone —"
                </p>
                <p className={`ch0-text-4 absolute ${caveat.className} text-2xl md:text-4xl text-neutral-300 italic invisible`}>
                  "has a name."
                </p>
              </div>

              {/* BEGIN SCROLL HINT */}
              <div className="section-0-hint absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-opacity duration-1000">
                <span className={`${cinzel.className} text-[10px] tracking-[0.6em] text-white/40 uppercase animate-pulse`}>Scroll to Begin</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
            </div>
          </section>

          {/* SECTION 1: THE NEURAL DESCENT (CHAPTER 1) */}
          <section className="min-h-screen h-screen w-full flex flex-col items-center justify-center text-center px-4 relative section-1 z-20 overflow-hidden bg-transparent">
            {/* NOISE/GRAIN OVERLAY (UNIFIER) */}
            <div className="absolute inset-0 z-[60] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]" />

            {/* ATMOSPHERIC DARK GREEN GLOW & HEAVY VIGNETTE */}
            <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)] bg-[radial-gradient(circle_at_center,rgba(80, 82, 81, 0)_0%,transparent_70%,black_100%)]" />

            {/* STARTING POINT: THE MICROSCOPIC DOT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="hero-dot w-1 h-1 rounded-full shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
            </div>

            {/* THE NEURAL IMAGE SEQUENCE - SCALED & POSITIONED TO HIDE ARTIFACTS */}
            <div className="absolute inset-0 z-0 opacity-0 neural-container mix-blend-screen scale-[1.15] translate-x-[2%] translate-y-[2%]">
              <ImageSequence
                ref={neuralSequenceRef}
                frameCount={240}
                imagePathPrefix="/neural_sequence/ezgif-frame-"
                imageExtension=".webp"
                padding={3}
                onLoadComplete={handleAssetLoad}
              />
            </div>

            <div className="section-1-content absolute inset-0 z-10 flex flex-col items-center justify-start pt-[30vh] w-full pointer-events-none">

              {/* PHASE 2: Gotham Reveal & Subtitles */}
              <h1 className={`ch1-main-word ${cinzelDeco.className} text-7xl md:text-9xl lg:text-[10rem] text-white font-normal leading-none tracking-tighter invisible m-0`}>
                GOTHAM
              </h1>
              <p className={`ch1-subtitle ${cinzel.className} text-xl md:text-3xl text-white/40 tracking-[0.4em] uppercase invisible mt-4`}>
                isn't a city.
              </p>

              {/* THE QUOTE - Positioned absolutely in the center of the screen */}
              <div className="ch1-quote invisible absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div className="max-w-4xl mx-auto px-4">
                  <p className={`${caveat.className} text-4xl md:text-6xl lg:text-7xl text-neutral-200 italic leading-relaxed drop-shadow-[0_4px_30px_rgba(0,0,0,1)] text-center`}>
                    "The darkness doesn't start with a mask. It starts with a moment... where everything you knew was torn away."
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hero-scroll-hint">
              <span className="text-[10px] tracking-[0.5em] text-cyan-400/40 uppercase animate-pulse">Scroll to descend</span>
              <div className="w-[1px] h-20 bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
            </div>
          </section>

          {/* --- NEW PSYCHE SECTION --- */}
          <PsycheSection />

          {/* SECTION 1.5: THE MASTER BRIDGE */}
          <section className="h-screen w-full flex items-center justify-center relative bridge-master-container bg-transparent z-10 overflow-hidden">
            {/* UNIFIED ATMOSPHERIC BLENDING */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black via-black/40 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/40 to-transparent z-20 pointer-events-none" />

            {/* BEAT 1: THE CHILD */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <div className="max-w-4xl space-y-12">
                <h2 className={`bridge-text-1 ${cinzelDeco.className} text-3xl md:text-5xl text-white tracking-[0.4em] uppercase opacity-0 font-normal`}>
                  To understand the legend...
                </h2>
                <div className="w-16 h-[1px] bg-cyan-500/30 mx-auto bridge-text-1 opacity-0" />
                <h2 className={`bridge-text-1 ${caveat.className} text-2xl md:text-4xl text-cyan-400/60 opacity-0 italic`}>
                  You must first remember the child.
                </h2>
              </div>
            </div>

            {/* BEAT 2: THE FALL */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <div className="max-w-4xl space-y-12">
                <p className={`${caveat.className} bridge-text-2 text-2xl md:text-4xl text-neutral-400 font-light italic opacity-0`}>
                  Because before the cowl, before the city...
                </p>
                <h2 className={`bridge-text-2 ${cinzelDeco.className} text-3xl md:text-9xl text-cyan-400 tracking-[0.6em] uppercase font-normal drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] opacity-0`}>
                  THE FALL.
                </h2>
              </div>
            </div>

            {/* BEAT 3: THE PURPOSE */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <div className="max-w-4xl space-y-16">
                <div className="space-y-6">
                  <p className="bridge-text-3 text-lg md:text-xl text-neutral-500 tracking-[0.4em] uppercase opacity-0">
                    Down here, your name has no weight.
                  </p>
                  <p className="bridge-text-3 text-lg md:text-xl text-neutral-500 tracking-[0.4em] uppercase opacity-0">
                    Down here, you are stripped of everything but your fear.
                  </p>
                </div>

                <div className="space-y-10">
                  <h3 className={`bridge-text-3 ${cinzel.className} text-2xl md:text-4xl text-white tracking-[0.3em] uppercase opacity-0`}>
                    And in that fear...
                  </h3>
                  <h2 className={`bridge-text-3 ${cinzel.className} text-4xl md:text-7xl text-white tracking-[0.5em] uppercase opacity-0`}>
                    You find your purpose.
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: THE ORIGINS */}
          <section className="min-h-[300vh] relative bg-transparent">
            <CaveSwarmSection />
          </section>

          {/* SECTION 2.5: BATMAN X INDIA VISION */}
          <IndiaVisionSection />

          {/* SECTION 3: GOTHAM THEATER */}
          <div className="training-pin-wrapper">
            <section ref={trainingRef} className="h-screen bg-transparent relative z-10 overflow-hidden flex items-center">
              {/* Global Atmospheric Blending */}
              <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black via-black/40 to-transparent z-30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/40 to-transparent z-30 pointer-events-none" />

              {/* Top Bar Navigation (Sleeker) */}
              <div className="absolute top-12 left-0 w-full z-50 pointer-events-none px-12 flex justify-between items-center">
                <h2 className={`${cinzelDeco.className} text-xl md:text-2xl text-white/40 tracking-[0.6em] uppercase`}>
                  The Architect of Fear
                </h2>
                <div className="flex gap-4">
                  {[0, 1, 2, 3, 4].map(dot => (
                    <div
                      key={dot}
                      className={`h-[2px] transition-all duration-1000 ${activeTraining === dot
                        ? 'w-12 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]'
                        : activeTraining > dot
                          ? 'w-4 bg-yellow-500/20'
                          : 'w-2 bg-white/10'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Content Layout - Side by Side */}
              <div className="w-full max-w-7xl mx-auto px-12 flex flex-col md:flex-row items-center gap-12 h-full pt-20">

                {/* LEFT COLUMN: Narrative and Background Number */}
                <div className="flex-1 h-full flex flex-col justify-center relative">

                  {/* Background Number (Relocated behind text) */}
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 select-none">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`stage-num-${activeTraining}`}
                        initial={{ opacity: 0, x: -50, filter: "blur(20px)" }}
                        animate={{ opacity: 0.15, x: 0, filter: "blur(5px)" }}
                        exit={{ opacity: 0, x: 50, filter: "blur(20px)" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`${cinzel.className} text-[20rem] md:text-[25rem] text-white font-normal leading-none`}
                      >
                        0{activeTraining + 1}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="relative z-10 space-y-8">
                    <AnimatePresence mode="wait">
                      {[
                        { t: "Physical Conditioning", d: "The vessel must be ready for the war. Push your body beyond the breaking point to become something else." },
                        { t: "Criminology", d: "To hunt a monster, you must think like one. Understand the mind of the enemy better than they understand themselves." },
                        { t: "Stealth", d: "In the shadows, you are omnipresent. Move without being seen. Strike without being heard. Become the darkness." },
                        { t: "Escapology", d: "No cage can hold a man with no limits. No trap is absolute. Discipline of body and mind unlocks every door." },
                        { t: "Willpower", d: "The final barrier. Once the mind is conquered, the man is gone. Only the symbol remains. Only the justice remains." }
                      ].map((item, i) => (
                        activeTraining === i && (
                          <motion.div
                            key={`text-${i}`}
                            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start text-left gap-6"
                          >
                            <div className="flex items-center gap-4">
                              <span className={`${cinzel.className} text-yellow-500/60 text-xs tracking-[0.8em] uppercase`}>Discipline 0{i + 1}</span>
                              <div className="w-12 h-[1px] bg-yellow-500/30" />
                            </div>
                            <h3 className={`${cinzelDeco.className} text-4xl md:text-6xl text-white uppercase tracking-[0.2em] font-normal leading-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
                              {item.t.split(' ').map((word, idx) => (
                                <span key={idx} className="block">{word}</span>
                              ))}
                            </h3>
                            <p className={`${caveat.className} text-2xl md:text-3xl text-neutral-400 font-light leading-relaxed max-w-lg italic border-l-2 border-yellow-500/20 pl-6`}>
                              "{item.d}"
                            </p>
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* RIGHT COLUMN: 3D Spline Models */}
                <div className="flex-[1.2] h-full relative flex items-center justify-center">
                  {[
                    { url: "https://prod.spline.design/26nmPO0uxq6NKzAT/scene.splinecode", zoom: 2.2 },
                    { url: "https://prod.spline.design/G0arj7nDLQILkitK/scene.splinecode", zoom: 2.2 },
                    { url: "https://prod.spline.design/GgY0lC7zgR2mUMFg/scene.splinecode", zoom: 3.2 },
                    { url: "https://prod.spline.design/v7zQ5GUeLG0PjGf6/scene.splinecode", zoom: 0.5 },
                    { url: "https://prod.spline.design/M5ahZsen2TANraI8/scene.splinecode", zoom: 2.5 }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-1500 ease-out"
                      style={{
                        opacity: activeTraining === i ? 1 : 0,
                        transform: activeTraining === i
                          ? 'scale(1) translateX(0)'
                          : activeTraining > i
                            ? 'scale(0.8) translateY(-30vh)'
                            : 'scale(0.8) translateY(30vh)',
                        filter: activeTraining === i ? 'blur(0px)' : 'blur(40px)',
                        pointerEvents: activeTraining === i ? 'auto' : 'none',
                        zIndex: activeTraining === i ? 20 : 10,
                      }}
                    >
                      {/* Glowing Aura for Model */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
                      <div className="relative w-full aspect-square flex items-center justify-center">
                        <SplineCardModel scene={item.url} zoom={item.zoom} onLoadComplete={handleAssetLoad} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>
          </div>

          {/* Seamless Meltdown Gradient: Blends the starfield of Section 3 into the solid black Cowl section */}
          <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black via-black/90 to-transparent z-50 pointer-events-none" />


          {/* SECTION 4: THE MASK */}
          <div className="cowl-pin-wrapper">
            <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative cowl-section z-20 bg-black">
              {/* TOP BLEND — dissolves from the Theater starfield */}
              <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black via-black/60 to-transparent z-30 pointer-events-none" />

              {/* ATMOSPHERIC VIGNETTE — deep shadow ring around the cowl */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 70%, black 100%)',
                  opacity: Math.min(1, Math.max(0, (cowlProgress - 0.02) * 4)),
                }}
              />

              {/* THE COWL IMAGE SEQUENCE — no blend mode, pure on black */}
              <div
                className="absolute inset-0 z-20 scale-[1.0] md:scale-[1.05]"
                style={{
                  opacity: Math.min(0.95, Math.max(0, (cowlProgress - 0.02) * 3)),
                }}
              >
                <ImageSequence
                  ref={cowlSequenceRef}
                  frameCount={240}
                  imagePathPrefix="/cowl_sequence/ezgif-frame-"
                  imageExtension=".webp"
                  padding={3}
                  onLoadComplete={handleAssetLoad}
                />
              </div>

              {/* TEXT OVERLAY */}
              <div className="relative z-30 pointer-events-none">
                <h2
                  className={`${cinzelDeco.className} text-5xl md:text-8xl lg:text-[9rem] clip-text uppercase mb-6 leading-none drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] font-normal`}
                  style={{
                    opacity: cowlProgress < 0.02
                      ? 0
                      : cowlProgress < 0.12
                        ? (cowlProgress - 0.02) * 10
                        : cowlProgress < 0.4
                          ? 1
                          : Math.max(0, 1 - (cowlProgress - 0.4) * 10),
                  }}
                >
                  BEYOND THE MAN
                </h2>

                <p
                  className={`${caveat.className} text-3xl md:text-5xl lg:text-6xl text-neutral-300 italic drop-shadow-xl`}
                  style={{
                    opacity: cowlProgress < 0.5
                      ? 0
                      : cowlProgress < 0.6
                        ? (cowlProgress - 0.5) * 10
                        : cowlProgress < 0.85
                          ? 1
                          : Math.max(0, 1 - (cowlProgress - 0.85) * 7),
                    transform: `translateY(${cowlProgress < 0.5
                      ? 30
                      : cowlProgress < 0.6
                        ? Math.max(0, (1 - (cowlProgress - 0.5) * 10) * 30)
                        : 0
                      }px)`,
                  }}
                >
                  "It's not who I am underneath, but the shadow I cast that defines this city."
                </p>
              </div>

              {/* BOTTOM BLEND — dissolves into the Vigil */}
              <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black via-black/60 to-transparent z-30 pointer-events-none" />
            </section>
          </div>

          {/* SECTION 4.5: THE VIGIL */}
          <div className="vigil-pin-wrapper">
            <section className="h-screen relative bg-black overflow-hidden vigil-section z-20">
              {/* THE VIDEO — scroll-scrubbed image sequence */}
              <div
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  filter: `grayscale(0.6) brightness(${0.4 + vigilProgress * 0.3})`,
                  opacity: vigilProgress < 0.05 ? vigilProgress * 20 : vigilProgress > 0.9 ? Math.max(0, 1 - (vigilProgress - 0.9) * 10) : 1,
                }}
              >
                <ImageSequence
                  ref={vigilSequenceRef}
                  frameCount={240}
                  imagePathPrefix="/vigil_sequence_webp/ezgif-frame-"
                  imageExtension=".webp"
                  padding={3}
                  onLoadComplete={handleAssetLoad}
                />
              </div>

              {/* ATMOSPHERIC VIGNETTE */}
              <div className="absolute inset-0 z-10 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 60%, black 100%)'
              }} />

              {/* SCANLINE TEXTURE */}
              <div className="absolute inset-0 z-20 opacity-[0.04] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* NARRATIVE TEXT — timed to scroll progress */}
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-8">
                <div className="max-w-3xl text-center space-y-8">
                  {/* Beat 1: He watches */}
                  <p
                    className={`${cinzel.className} text-lg md:text-2xl text-white/70 tracking-[0.5em] uppercase transition-all duration-700`}
                    style={{
                      opacity: vigilProgress > 0.1 && vigilProgress < 0.4 ? Math.min(1, (vigilProgress - 0.1) * 10) : vigilProgress >= 0.4 ? Math.max(0, 1 - (vigilProgress - 0.4) * 10) : 0,
                      transform: `translateY(${vigilProgress < 0.15 ? 20 : 0}px)`,
                    }}
                  >
                    He watches. He waits.
                  </p>

                  {/* Beat 2: The city */}
                  <p
                    className={`${caveat.className} text-2xl md:text-5xl text-neutral-300 italic transition-all duration-700`}
                    style={{
                      opacity: vigilProgress > 0.35 && vigilProgress < 0.65 ? Math.min(1, (vigilProgress - 0.35) * 10) : vigilProgress >= 0.65 ? Math.max(0, 1 - (vigilProgress - 0.65) * 10) : 0,
                      transform: `translateY(${vigilProgress < 0.4 ? 30 : 0}px)`,
                    }}
                  >
                    "The city doesn't know it yet... but tonight, everything changes."
                  </p>

                  {/* Beat 3: The descent prompt */}
                  <p
                    className={`${cinzelDeco.className} text-3xl md:text-6xl text-white uppercase tracking-[0.3em] font-normal transition-all duration-700`}
                    style={{
                      opacity: vigilProgress > 0.7 && vigilProgress < 0.95 ? Math.min(1, (vigilProgress - 0.7) * 5) : vigilProgress >= 0.95 ? Math.max(0, 1 - (vigilProgress - 0.95) * 20) : 0,
                      transform: `scale(${0.9 + Math.min(0.1, (vigilProgress - 0.7) * 0.5)})`,
                      filter: `blur(${vigilProgress < 0.75 ? Math.max(0, 10 - (vigilProgress - 0.7) * 200) : 0}px)`,
                    }}
                  >
                    The Descent
                  </p>
                </div>
              </div>

              {/* HUD METADATA */}
              <div className="absolute top-12 left-12 z-30 pointer-events-none" style={{ opacity: vigilProgress > 0.05 ? 0.4 : 0 }}>
                <div className="font-mono text-[9px] text-cyan-500/60 uppercase tracking-[0.4em] leading-relaxed">
                  SYSTEM: VIGIL_ACTIVE<br />
                  LOCATION: GOTHAM_SKYLINE<br />
                  STATUS: MONITORING
                </div>
              </div>

              {/* BOTTOM BLEND — dissolves into Rappel */}
              <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none" />
            </section>
          </div>

          {/* SECTION 5: THE CITY */}
          <section className="min-h-[600vh] relative bg-transparent">
            {/* BOTTOM BLEND MASK */}
            <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/40 to-transparent z-20 pointer-events-none" />
            <RappelSection />
          </section>

          {/* SECTION 6: THE DEMONS */}
          <section className="relative bg-transparent">
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-black via-black/40 to-transparent z-20 pointer-events-none" />
            <JokerSection key="joker-experience" />
          </section>



          {/* SECTION 7: THE ARCHIVE (PURPOSE + TUNNEL) */}
          <div key="purpose-isolated-wrap">
            <PurposeSection />
          </div>

          <div key="tunnel-isolated-wrap">
            <HistoryTunnel key="history-vortex" />
          </div>

          <div key="call-isolated-wrap" className="relative bubble-reveal-trigger">
            <BubbleReveal />
          </div>

          {/* SECTION 8: THE VOW */}
          <div key="vow-isolated-wrap" className="vow-pin-wrapper">
            <section key="vow-finale" className="min-h-screen flex flex-col justify-center px-8 md:px-24 reveal-section relative bg-transparent pt-32 pb-32 overflow-hidden vow-section">
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <ImageSequence
                  ref={symbolSequenceRef}
                  frameCount={40}
                  imagePathPrefix="/symbol_sequence/ezgif-frame-"
                  imageExtension=".webp"
                  padding={3}
                  onLoadComplete={handleAssetLoad}
                />
              </div>

              <div className="max-w-4xl relative z-10 mx-auto text-center">
                <h2 className={`${cinzelDeco.className} text-5xl md:text-8xl mb-12 text-white uppercase tracking-widest font-normal opacity-0 vow-title`}>
                  One Rule.
                </h2>
                <div className="space-y-12">
                  <p className={`${caveat.className} text-3xl md:text-5xl text-neutral-400 italic leading-relaxed opacity-0 vow-quote`}>
                    "The city is a storm. The demon is a fire. But you... you are the line that does not break. This is your Dharma. This is your one rule."
                  </p>

                  <div className="flex flex-col items-center gap-8 py-12 opacity-0 vow-button-wrap">
                    <VowButton onComplete={() => console.log("VOW_SEALED")} />
                    <p className={`${caveat.className} text-xl md:text-2xl tracking-widest text-white/40 italic`}>Hold to Initiate Vow</p>
                  </div>

                  <div className="h-[2px] w-32 bg-yellow-500 mx-auto opacity-0 vow-footer" />
                  <p className="text-lg md:text-xl text-neutral-500 font-light max-w-2xl mx-auto opacity-0 vow-footer">
                    In a world of absolute chaos, a single line of discipline separates the hero from the monster. This is the code. This is the justice we deserve.
                  </p>
                </div>
              </div>
            </section>
          </div>



          {/* SECTION 10: THE ARRIVAL (BAT REVEAL) */}
          <div className="arrival-pin-wrapper">
            <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 arrival-section bg-gradient-to-t from-[#0a0a0f] via-black to-transparent relative overflow-hidden arrival-trigger">
              <div className="absolute inset-0 z-0 opacity-40 scale-110 pointer-events-none">
                <ImageSequence
                  ref={batSequenceRef}
                  frameCount={240}
                  imagePathPrefix="/bat_sequence/ezgif-frame-"
                  imageExtension=".webp"
                  padding={3}
                  onLoadComplete={handleAssetLoad}
                />
              </div>

              <div className="relative z-10">
                <p
                  className={`${cinzel.className} text-lg md:text-xl text-neutral-500 tracking-[0.5em] uppercase mb-6`}
                  style={{
                    opacity: batProgress < 0.2 ? 0 : Math.min(1, (batProgress - 0.2) * 5),
                    transform: `translateY(${Math.max(0, 20 - (batProgress - 0.2) * 100)}px)`,
                    filter: `blur(${Math.max(0, 10 - (batProgress - 0.2) * 50)}px)`
                  }}
                >
                  Welcome to
                </p>
                <h1
                  className={`${cinzelDeco.className} text-6xl md:text-[8rem] lg:text-[10rem] text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-12 leading-none uppercase tracking-tighter clip-text-gold font-bold`}
                  style={{
                    opacity: batProgress < 0.3 ? 0 : Math.min(1, (batProgress - 0.3) * 4),
                    transform: `scale(${0.8 + Math.min(0.2, (batProgress - 0.3) * 0.5)}) translateY(${Math.max(0, 30 - (batProgress - 0.3) * 100)}px)`,
                    filter: `blur(${Math.max(0, 20 - (batProgress - 0.3) * 60)}px)`,
                    fontWeight: 700
                  }}
                >
                  Project<br />Gotham
                </h1>
                <button
                  onClick={() => setShowModal(true)}
                  className="group relative px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/20 transition-all duration-500 overflow-hidden flex items-center gap-4 mx-auto"
                >
                  <div className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-700 ease-out z-0"></div>
                  <span className="relative z-10 cinzel uppercase tracking-widest text-lg group-hover:text-black transition-colors duration-500 font-normal">
                    Claim The Mantle
                  </span>
                  <ChevronRight className="relative z-10 group-hover:text-black w-5 h-5 transition-colors duration-500" />
                </button>
              </div>
            </section>
          </div>

          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-transparent/80 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h3 className="cinzel text-3xl mb-4 text-white uppercase tracking-wider">
                    The City Needs You
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="ENTER YOUR ALIAS"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm tracking-widest text-white uppercase"
                    />
                    <button className="w-full bg-white text-black py-4 cinzel font-bold tracking-widest uppercase">
                      Enter The Cave
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* FINAL SIGN-OFF */}
          <footer className="py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-30 hover:opacity-100 transition-all duration-1000">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
            <p className={`${cinzel.className} text-[10px] tracking-[0.8em] text-white/40 uppercase font-light`}>
              Made with Love, for the Bros
            </p>
            <p className={`${caveat.className} text-3xl text-yellow-500/50 drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]`}>
              by Kushal aka Jinchuriki
            </p>
            <div className="pt-12 flex gap-6">
               <div className="w-1 h-1 rounded-full bg-white/5 animate-pulse" />
               <div className="w-1 h-1 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
               <div className="w-1 h-1 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </footer>

          <AudioEngine />
        </main>
      </div>
    </>
  );
}

function VowButton({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isHolding) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const newProgress = Math.min((elapsed / 2000) * 100, 100);
        setProgress(newProgress);
        if (newProgress >= 100) {
          clearInterval(timerRef.current!);
          onCompleteRef.current();
        }
      }, 16);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(prev => prev === 0 ? 0 : 0); // Only set if not already 0 internally by React
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHolding]);

  return (
    <button
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
      className="relative w-24 h-24 rounded-full border border-white/10 flex items-center justify-center group transition-all duration-500 hover:border-yellow-500/50"
    >
      <div className="absolute inset-0 rounded-full border-2 border-yellow-500 opacity-20 scale-110 group-hover:animate-ping" />
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
        <circle
          cx="48" cy="48" r="46"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-yellow-500"
          style={{
            strokeDasharray: 289,
            strokeDashoffset: 289 - (289 * progress) / 100,
            transition: 'stroke-dashoffset 100ms linear'
          }}
        />
      </svg>
      <div className={`cinzel text-[10px] tracking-widest transition-colors ${progress >= 100 ? 'text-yellow-500 animate-pulse' : 'text-white/40'}`}>
        {progress >= 100 ? "VOW_SEALED" : "SIGN_CODE"}
      </div>
    </button>
  );
}
