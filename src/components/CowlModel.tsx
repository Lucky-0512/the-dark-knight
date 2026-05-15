"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

export function CowlModel() {
  // Load the GLB file directly from the public folder
  const R2_URL = "https://pub-2773ce4c8a7943ae910bea9bf075b720.r2.dev";
  const { scene } = useGLTF(`${R2_URL}/cowl.glb`);
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Calculate target rotation based on mouse position
      // Subtle movements so it feels heavy and realistic
      const targetX = (mouse.x * viewport.width) / 10;
      const targetY = (mouse.y * viewport.height) / 10;
      
      // Smoothly interpolate current rotation towards target rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={1.5}>
      <primitive object={scene} />
      {/* Add subtle dynamic lighting to make the carbon fiber pop */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
    </group>
  );
}

// Preload the model so it doesn't pop in late
useGLTF.preload("https://pub-2773ce4c8a7943ae910bea9bf075b720.r2.dev/cowl.glb");
