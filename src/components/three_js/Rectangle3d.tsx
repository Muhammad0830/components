"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function ReactRectangle3D() {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Rectangle />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

function Rectangle() {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y += 0.01;
      edgesRef.current.rotation.x += 0.005;
    }
  });

  return (
    <>
      {/* Solid box */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 2, 1]} />
        <meshStandardMaterial color="#444444" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 2, 1)]} />
        <lineBasicMaterial color="#ffffff" linewidth={1} />
      </lineSegments>
    </>
  );
}
