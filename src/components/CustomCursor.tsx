"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the "lagging" outer ring
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") !== null ||
        target.style.cursor === "pointer"
      );
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* OUTER RING (Lagging) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/40 rounded-full flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(34, 211, 238, 0.1)" : "transparent",
        }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
      >
        {/* CROSSHAIR TABS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-500/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-500/60" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-cyan-500/60" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-cyan-500/60" />
      </motion.div>

      {/* CENTER DOT (Precise) */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}
