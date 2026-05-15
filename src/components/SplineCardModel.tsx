"use client";
import Spline from '@splinetool/react-spline';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface SplineCardModelProps {
  scene: string;
  zoom?: number;
  onLoadComplete?: () => void;
}

export default function SplineCardModel({ scene, zoom = 3.0, onLoadComplete }: SplineCardModelProps) {
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax Hover Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-250, 250], [-15, 15]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ignore synthetic events to prevent infinite loops
      if (!e.isTrusted) return;
      
      // Completely block Spline from receiving the scroll event (Kills Zoom)
      e.stopPropagation();
      e.preventDefault();

      // Clone the event and send it directly to the window so Lenis can scroll the page smoothly
      window.dispatchEvent(new WheelEvent('wheel', {
        deltaY: e.deltaY,
        deltaX: e.deltaX,
        deltaZ: e.deltaZ,
        deltaMode: e.deltaMode,
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
      }));
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    }
    return () => el?.removeEventListener('wheel', handleWheel, { capture: true });
  }, []);

  const hasLoadedRef = useRef(false);

  const onLoad = useCallback((splineApp: any) => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // CUSTOM CALIBRATED SCALE
    splineApp.setZoom(zoom);
    
    // Hard Lock Controls
    if (splineApp.controls) {
      splineApp.controls.enableZoom = false;
      splineApp.controls.enablePan = false;
      splineApp.controls.maxDistance = splineApp.controls.minDistance = 400;
      // Slow cinematic auto-rotation
      splineApp.controls.autoRotate = true;
      splineApp.controls.autoRotateSpeed = 0.4;
    }
    
    splineRef.current = splineApp;
    setIsLoaded(true);
    onLoadComplete?.();
  }, [zoom, onLoadComplete]);

  function handleMouseEnter() {
    if (splineRef.current) {
      splineRef.current.emitEvent('mouseEnter', 'hover'); 
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    if (splineRef.current) {
      splineRef.current.emitEvent('mouseLeave', 'base');
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] group flex items-center justify-center touch-none"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="cinzel text-[10px] text-yellow-500/20 tracking-widest animate-pulse">
            CALIBRATING_3D...
          </div>
        </div>
      )}
      <motion.div
        animate={{
          y: [0, -5, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ rotateX, rotateY }}
        className="w-full h-full flex items-center justify-center"
      >
        <Spline
          scene={scene}
          onLoad={onLoad}
          className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} pointer-events-auto`}
        />
      </motion.div>
    </div>
  );
}
