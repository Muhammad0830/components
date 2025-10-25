"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

export default function ReactLogo3D() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full h-[400px] flex items-center justify-center bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <ReactLogo hovered={hovered} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

function ReactLogo({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);

  useFrame(() => {
    if (hovered && groupRef.current) {
      groupRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerMove={(e) => {
        if (dragging && groupRef.current) {
          groupRef.current.rotation.y += e.movementX * 0.01;
          groupRef.current.rotation.x += e.movementY * 0.01;
        }
      }}
    >
      <ReactSymbol color="#61dafb" />
    </group>
  );
}

function ReactSymbol({ color }: { color: string }) {
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.3,
  });

  return (
    <group scale={1.3}>
      {/* Each ring rotated differently in 3D space */}
      <Ring material={material} rotation={[Math.PI / 2, 0, 0]} /> {/* horizontal */}
      <Ring material={material} rotation={[Math.PI / 2.5, Math.PI / 3, 0]} /> {/* tilted right */}
      <Ring material={material} rotation={[Math.PI / 2.5, -Math.PI / 3, 0]} /> {/* tilted left */}

      {/* Center nucleus */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function Ring({
  material,
  rotation,
}: {
  material: THREE.Material;
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={ref} rotation={rotation}>
      {/* radius, thickness, radial segments, tubular segments */}
      <torusGeometry args={[1.2, 0.05, 16, 100]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
