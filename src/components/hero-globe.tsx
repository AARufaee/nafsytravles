"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";
import { createEarthTexture } from "./earth-texture";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createEarthTexture(), []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.045;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial map={texture} metalness={0.15} roughness={0.65} />
      </mesh>
      {/* Soft atmosphere glow */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#34b8f0" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function orbitPoint(angle: number, radius: number, out: THREE.Vector3) {
  out.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.06, Math.sin(angle) * radius);
  return out;
}

function FlightLoop({
  radius,
  speed,
  tilt,
  phase,
  color,
}: {
  radius: number;
  speed: number;
  tilt: [number, number, number];
  phase: number;
  color: string;
}) {
  const planeRef = useRef<THREE.Group>(null);
  const angleRef = useRef(phase);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    angleRef.current += delta * speed;
    const angle = angleRef.current;
    const group = planeRef.current;
    if (!group) return;

    orbitPoint(angle, radius, group.position);
    orbitPoint(angle + Math.sign(speed || 1) * 0.01, radius, target);
    group.lookAt(target);
    group.rotateZ(0.3);
  });

  return (
    <group rotation={tilt}>
      <Trail width={1.6} length={5} color={color} attenuation={(t) => t * t}>
        <group ref={planeRef}>
          {/* Re-orient the cone so its tip (local +Y) points along -Z, matching lookAt's forward axis. */}
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <coneGeometry args={[0.045, 0.22, 6]} />
              <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>
      </Trail>
    </group>
  );
}

export default function HeroGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 2, 4]} intensity={1.3} color="#7fdcff" />
      <pointLight position={[-3, -2, -2]} intensity={0.5} color="#34b8f0" />
      <Globe />
      <FlightLoop radius={2.1} speed={0.16} tilt={[0.45, 0, 0.3]} phase={0} color="#7fdcff" />
      <FlightLoop radius={2.4} speed={-0.11} tilt={[-0.3, 0.5, -0.2]} phase={2.1} color="#a5e6ff" />
      <FlightLoop radius={1.85} speed={0.13} tilt={[0.15, -0.6, 0.5]} phase={4.2} color="#5fb8e8" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
