"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Environment } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  const count = 5000;
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  useEffect(() => {
    if (!ref.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const trigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        if (ref.current) {
          gsap.to(ref.current.position, {
            y: self.progress * 5,
            z: self.progress * 2,
            duration: 0.5,
            overwrite: "auto"
          });
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function Experience() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#5566aa" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
