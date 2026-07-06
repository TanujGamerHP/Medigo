'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

export default function FloatingElements() {
  const largeSphereRef = useRef<Mesh>(null);
  const torusRef = useRef<Mesh>(null);
  const smallSphereRef = useRef<Mesh>(null);
  const accentDot1Ref = useRef<Mesh>(null);
  const accentDot2Ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const speed = delta * 0.3;

    if (largeSphereRef.current) {
      largeSphereRef.current.rotation.x += speed * 0.5;
      largeSphereRef.current.rotation.z += speed * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += speed * 0.8;
      torusRef.current.rotation.y += speed * 0.4;
    }
    if (smallSphereRef.current) {
      smallSphereRef.current.rotation.y += speed * 0.6;
      smallSphereRef.current.rotation.z += speed * 0.4;
    }
    if (accentDot1Ref.current) {
      accentDot1Ref.current.rotation.y += speed;
    }
    if (accentDot2Ref.current) {
      accentDot2Ref.current.rotation.x += speed * 0.7;
    }
  });

  return (
    <>
      {/* 1. Large organic green sphere — right side */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere ref={largeSphereRef} args={[1.2, 64, 64]} position={[3, 0.5, -1]}>
          <MeshDistortMaterial
            color="#22C55E"
            transparent
            opacity={0.15}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.1}
          />
        </Sphere>
      </Float>

      {/* 2. Torus ring — top left */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
        <Torus
          ref={torusRef}
          args={[0.5, 0.12, 16, 48]}
          position={[-3.5, 2, -2]}
        >
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.3}
            transparent
            opacity={0.25}
            roughness={0.3}
            metalness={0.5}
          />
        </Torus>
      </Float>

      {/* 3. Small blue accent sphere — bottom left */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere ref={smallSphereRef} args={[0.6, 48, 48]} position={[-2.5, -1.5, -1.5]}>
          <MeshDistortMaterial
            color="#3B82F6"
            transparent
            opacity={0.12}
            distort={0.35}
            speed={1.5}
            roughness={0.3}
            metalness={0.2}
          />
        </Sphere>
      </Float>

      {/* 4a. Tiny accent dot — upper right */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={1}>
        <Sphere ref={accentDot1Ref} args={[0.08, 16, 16]} position={[2, 2.5, -0.5]}>
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
          />
        </Sphere>
      </Float>

      {/* 4b. Tiny accent dot — lower right */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <Sphere ref={accentDot2Ref} args={[0.06, 16, 16]} position={[1.5, -2, 0]}>
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.45}
          />
        </Sphere>
      </Float>
    </>
  );
}
