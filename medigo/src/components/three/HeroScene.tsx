'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import ParticleField from './ParticleField';
import FloatingElements from './FloatingElements';

/** Invisible group that follows the mouse pointer to subtly shift the scene */
function MouseFollowRig() {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth lerp toward pointer position (scaled down for subtlety)
    const targetX = pointer.x * 0.3;
    const targetY = pointer.y * 0.2;

    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <ParticleField />
      <FloatingElements />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      id="hero-3d-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      className="pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Scene contents wrapped in mouse-follow rig */}
      <MouseFollowRig />
    </Canvas>
  );
}
