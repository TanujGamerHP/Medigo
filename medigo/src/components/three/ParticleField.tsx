'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Points } from 'three';

/** Generate positions uniformly distributed within a sphere of given radius */
function generateSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Uniform distribution inside a sphere
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

export default function ParticleField() {
  const primaryRef = useRef<Points>(null);
  const accentRef = useRef<Points>(null);

  // Memoize positions so they don't regenerate on re-render
  const primaryPositions = useMemo(() => generateSpherePositions(2000, 6), []);
  const accentPositions = useMemo(() => generateSpherePositions(500, 5), []);

  useFrame(() => {
    if (primaryRef.current) {
      primaryRef.current.rotation.y += 0.0003;
      primaryRef.current.rotation.x += 0.0001;
    }
    if (accentRef.current) {
      accentRef.current.rotation.y -= 0.0002;
      accentRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <>
      {/* Primary green particles */}
      <points ref={primaryRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[primaryPositions, 3]}
            count={2000}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#22C55E"
          size={0.015}
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Accent blue particles */}
      <points ref={accentRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[accentPositions, 3]}
            count={500}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#3B82F6"
          size={0.01}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  );
}
