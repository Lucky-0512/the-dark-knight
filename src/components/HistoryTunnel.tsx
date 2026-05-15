"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  {
    id: "01",
    title: "THE DESCENT",
    desc: "The well of silence. Where the child died.",
    meta: "LOG_ID: DHARMA_ZERO",
    color: "#ffffff"
  },
  {
    id: "02",
    title: "THE TAPASYA",
    desc: "Seven years of silence. Forging the body into a weapon.",
    meta: "LOG_ID: YOGA_CORE_ACTIVE",
    color: "#eab308"
  },
  {
    id: "03",
    title: "THE AVATAR",
    desc: "More than a man. A symbol that cannot be broken.",
    meta: "LOG_ID: SHAKTI_INITIATED",
    color: "#ffffff"
  },
  {
    id: "04",
    title: "THE TANDAVA",
    desc: "Dancing with the demon in the streets of fire.",
    meta: "LOG_ID: KALI_VORTEX",
    color: "#39FF14"
  }
];

export function HistoryTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    let ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray(".history-node");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=1200%", // Significantly lengthened for a slower, more epic scrub
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 55
        }
      });

      // Add a generous initial pause so the transition from Purpose doesn't feel abrupt
      tl.to({}, { duration: 10 });

      // Animate each node with a deliberate hold and zoom
      nodes.forEach((node: any, i) => {
        tl.fromTo(node,
          {
            z: -10000,
            opacity: 0,
            scale: 0.01
          },
          {
            z: 0,
            opacity: 1,
            scale: 1,
            duration: 10,
            ease: "power3.out"
          }
        )
          // THE HOLD: Stay in center for reading
          .to({}, { duration: 15 })
          // THE EXIT: Fly past the camera aggressively
          .to(node, {
            opacity: 0,
            scale: 20,
            z: 5000,
            duration: 10,
            ease: "power3.in"
          });
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full h-screen overflow-hidden perspective-1000 z-10 history-tunnel-trigger">

      {/* TUNNEL BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black z-20" />

        {/* Rotating UI Rings (Digital Compass) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] opacity-10">
          <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
          <div className="absolute inset-20 border border-white/5 rounded-full animate-reverse-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute inset-40 border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '40s' }} />
        </div>

        {/* Floating Data Bits */}
        {isMounted && (
          <div className="absolute inset-0 z-10 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center transform-style-3d">
        {NODES.map((node, i) => (
          <div
            key={i}
            className="history-node absolute w-[90vw] md:w-[600px] h-[400px] flex items-center justify-center pointer-events-none opacity-0"
          >
            {/* THE NODE FRAME */}
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              className="relative w-full h-full border border-white/10 bg-white/[0.02] backdrop-blur-md p-10 flex flex-col justify-between group pointer-events-auto cursor-crosshair transition-all duration-500"
            >
              {/* Biometric Pulse Indicator */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/40 group-hover:border-yellow-500 transition-colors" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/40 group-hover:border-yellow-500 transition-colors" />

              {/* HUD DECORATIONS */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-1.5 h-1.5 bg-white/40 group-hover:bg-yellow-500 animate-pulse" />
                <div className="w-12 h-[1px] bg-white/20 mt-1" />
              </div>
              <div className={`absolute bottom-4 right-4 text-[10px] ${cinzel.className} text-white/20 tracking-widest group-hover:text-yellow-500/40`}>
                {node.meta}
              </div>

              {/* CONTENT */}
              <div className="space-y-4">
                <span className={`${cinzel.className} text-xs tracking-[0.5em] text-white/40 block mb-2 group-hover:text-yellow-500/60`}>NODE_{node.id}</span>
                <h3 className={`${cinzelDeco.className} text-4xl md:text-6xl text-white tracking-widest uppercase transition-colors font-normal`} style={{ color: node.color }}>
                  {node.title}
                </h3>
                <div className="w-12 h-[1px] bg-white/20 group-hover:w-full transition-all duration-700" />
                <p className={`${caveat.className} text-neutral-500 text-2xl md:text-4xl font-light italic max-w-sm group-hover:text-neutral-300`}>
                  "{node.desc}"
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-[8px] cinzel text-white/10 flex flex-col group-hover:text-white/30">
                  <span>STABILITY: NOMINAL</span>
                  <span>SYNC_STATUS: 100%</span>
                </div>
                <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-yellow-500/50">
                  <div className="w-1 h-1 bg-white/40 group-hover:bg-yellow-500" />
                </div>
              </div>

              {/* SCANLINE OVERLAY */}
              <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px]" />
            </motion.div>
          </div>
        ))}

        {/* FINAL VOW TRIGGER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          {/* We will add the Symbol and One Rule here at the end of the tunnel timeline */}
        </motion.div>
      </div>
    </div>
  );
}
