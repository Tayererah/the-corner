"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Floating 3D Geometric Campus Artifacts
function CampusArtifacts({ mode }: { mode: "buy" | "sell" }) {
  const groupRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth pointer parallax
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      pointer.x * 0.45,
      3,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -pointer.y * 0.25,
      3,
      delta
    );

    // Continuous orbital micro-rotations
    if (bookRef.current) {
      bookRef.current.rotation.y += delta * 0.4;
      bookRef.current.rotation.x += delta * 0.2;
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.y -= delta * 0.5;
      crystalRef.current.rotation.z += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.35;
      ringRef.current.rotation.y += delta * 0.4;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.6;
    }
  });

  const primaryColor = mode === "buy" ? "#F0631D" : "#10b981";
  const accentColor = mode === "buy" ? "#3b82f6" : "#F0631D";

  return (
    <group ref={groupRef}>
      {/* 1. Textbook Artifact (Rectangular Cuboid) */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.4} position={[-2.2, 0.8, -0.5]}>
        <mesh ref={bookRef}>
          <boxGeometry args={[0.9, 1.3, 0.25]} />
          <meshStandardMaterial
            color="#F0631D"
            metalness={0.4}
            roughness={0.3}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* 2. Electronics Polyhedron Crystal */}
      <Float speed={2.2} rotationIntensity={0.8} floatIntensity={1.6} position={[2.3, 1.1, -0.8]}>
        <mesh ref={crystalRef}>
          <octahedronGeometry args={[0.85, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.8}
            roughness={0.15}
            wireframe
          />
        </mesh>
      </Float>

      {/* 3. Varsity Fashion Torus Ring */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2} position={[-1.8, -1.2, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[0.75, 0.22, 16, 40]} />
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      </Float>

      {/* 4. Central Campus Core Orb with Fluid Distortion */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} position={[0, -0.1, -1.2]}>
        <mesh ref={sphereRef} scale={1.45}>
          <icosahedronGeometry args={[1, 3]} />
          <MeshDistortMaterial
            color={primaryColor}
            distort={0.4}
            speed={2.2}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* 5. Services Diamond Spark */}
      <Float speed={2.5} rotationIntensity={1.0} floatIntensity={1.5} position={[1.9, -1.3, -0.2]}>
        <mesh>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={accentColor}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Particle Constellation Field
function ParticleSwarm({ count = 220 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color("#F0631D");
    const colorB = new THREE.Color("#10b981");
    const colorC = new THREE.Color("#38bdf8");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 14;
      pos[idx + 1] = (Math.random() - 0.5) * 10;
      pos[idx + 2] = (Math.random() - 0.5) * 8 - 1;

      const choice = Math.random();
      const c = choice > 0.6 ? colorA : choice > 0.3 ? colorB : colorC;
      col[idx] = c.r;
      col[idx + 1] = c.g;
      col[idx + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CinematicCanvas3D({ mode }: { mode: "buy" | "sell" }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#fff" />
        <pointLight position={[-4, -3, 2]} intensity={1.8} color="#F0631D" />
        <pointLight position={[4, -2, 2]} intensity={1.6} color="#10b981" />
        <CampusArtifacts mode={mode} />
        <ParticleSwarm count={180} />
      </Canvas>
    </div>
  );
}
