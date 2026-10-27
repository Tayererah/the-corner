"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

export default function HeroOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <MeshDistortMaterial
            color="#3FA274"
            distort={0.35}
            speed={1.5}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </Float>
    </Canvas>
  );
}