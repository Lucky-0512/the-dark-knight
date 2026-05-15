"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Activity } from "lucide-react";
import { cinzel } from "@/lib/fonts";

const TRACKS = [
  { id: "opening", src: "/music/opening_music_ifeel.mp3", label: "THE ARRIVAL" },
  { id: "world", src: "/music/orchestral_violin_otham city.mp3", label: "THE ORIGINS" },
  { id: "drama", src: "/music/perfect_violin_capturing_the dramtic_essence.mp3", label: "THE CRUCIBLE" },
  { id: "victory", src: "/music/victory music_motivational.mp3", label: "THE VOW" }
];

export function AudioEngine() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [activeTrack, setActiveTrack] = useState<string>("opening");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const R2_URL = "https://pub-2773ce4c8a7943ae910bea9bf075b720.r2.dev";

    // Initialize audio objects
    TRACKS.forEach(track => {
      const fullSrc = track.src.startsWith("/") ? `${R2_URL}${track.src}` : track.src;
      const audio = new Audio(fullSrc);
      audio.loop = true;
      audio.volume = 0;
      audioRefs.current[track.id] = audio;
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const startAudio = () => {
    setIsStarted(true);
    Object.values(audioRefs.current).forEach(audio => {
      audio.play().catch(e => console.log("Audio play blocked", e));
    });

    // Initial fade in for first track
    gsap.to(audioRefs.current["opening"], { volume: 0.5, duration: 2 });
    setupScrollSync();
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    Object.values(audioRefs.current).forEach(audio => {
      gsap.to(audio, {
        volume: newMute ? 0 : (activeTrack === audio.id ? 0.5 : 0),
        duration: 0.5
      });
    });
  };

  const setupScrollSync = () => {
    // We map the total scroll length to track volumes
    // Track 1: 0% - 25%
    // Track 2: 25% - 50%
    // Track 3: 50% - 75%
    // Track 4: 75% - 100%

    const sections = [
      { id: "opening", range: [0, 0.25] },
      { id: "world", range: [0.25, 0.5] },
      { id: "drama", range: [0.5, 0.65] },
      { id: "victory", range: [0.65, 1] }
    ];

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        sections.forEach(section => {
          const audio = audioRefs.current[section.id];
          if (!audio) return;

          // Calculate volume based on proximity to this section's range
          let volume = 0;
          const [start, end] = section.range;
          const mid = (start + end) / 2;
          const dist = Math.abs(progress - mid);
          const rangeWidth = (end - start);

          if (progress >= start && progress <= end) {
            // Peak at the middle of the range
            volume = 1 - (dist / (rangeWidth / 2));
            setActiveTrack(section.id);
          } else {
            volume = 0;
          }

          if (!isMuted) {
            gsap.to(audio, { volume: volume * 0.6, duration: 0.5, overwrite: true });
          }
        });
      }
    });
  };

  return (
    <div className="fixed bottom-12 left-12 z-[100] pointer-events-auto">
      <AnimatePresence>
        {!isStarted ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={startAudio}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full group hover:bg-[#a8c8e8]/10 transition-colors"
          >
            <Activity className="w-4 h-4 text-[#a8c8e8] animate-pulse" />
            <span className={`${cinzel.className} text-[10px] tracking-[0.4em] text-white/80 uppercase`}>
              Enable Audio
            </span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {/* MUTE TOGGLE */}
            <button
              onClick={toggleMute}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 hover:text-white transition-colors relative"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#a8c8e8]" />}
              {!isMuted && (
                <motion.div
                  layoutId="sound-ring"
                  className="absolute inset-0 rounded-full border border-[#a8c8e8]/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </button>

            {/* TRACK MONITOR */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-[2px] h-3 items-end">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={isMuted ? { height: 2 } : { height: [4, 12, 6, 14, 8][i - 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, repeatType: "reverse" }}
                      className="w-[2px] bg-[#a8c8e8]/60"
                    />
                  ))}
                </div>
                <span className={`${cinzel.className} text-[9px] tracking-[0.5em] text-white/40 uppercase`}>
                  Signal: Active
                </span>
              </div>
              <span className={`${cinzel.className} text-[11px] tracking-[0.2em] text-[#a8c8e8] uppercase`}>
                {TRACKS.find(t => t.id === activeTrack)?.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
