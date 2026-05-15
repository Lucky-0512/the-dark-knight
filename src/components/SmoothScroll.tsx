"use client";
import { useEffect, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly more resistance for precision
      touchMultiplier: 1.5,
      lerp: 0.08, // Increased damping for "held" feel
      syncTouch: true,
    });

    // 2. Sync ScrollTrigger with Lenis
    const updateScrollTrigger = () => ScrollTrigger.update();
    lenis.on('scroll', updateScrollTrigger);

    // 3. Force GSAP to use Lenis's requestAnimationFrame
    const updateGsap = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateGsap);

    // 4. Reset ticker on clean up
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenis.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(updateGsap);
    };
  }, []);

  return <>{children}</>;
}
