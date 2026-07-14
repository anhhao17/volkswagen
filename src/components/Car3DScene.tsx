"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildVWBeetle } from "./VWBeetleModel";
import { sampleKeyframes } from "./car3dKeyframes";

/**
 * Scroll-driven 3D car canvas.
 *
 * Receives a shared progress ref (0..1) from the parent section and dollies
 * the camera along the keyframe spline.
 * Renders a stylized VW Beetle built from Three.js primitives.
 */

function CarModel() {
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    const beetle = buildVWBeetle();
    g.add(beetle);
    return () => {
      g.remove(beetle);
      beetle.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
    };
  }, []);

  return <group ref={group} />;
}

function ScrollCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.5, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    sampleKeyframes(progressRef.current, tmpPos.current, tmpTarget.current);
    camera.position.lerp(tmpPos.current, 0.12);
    target.current.lerp(tmpTarget.current, 0.12);
    camera.lookAt(target.current);
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#ffffff", "#223044", 0.5]} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} castShadow />
      <directionalLight position={[-6, 5, -4]} intensity={0.4} color="#88aaff" />
      <pointLight position={[0, 1.2, 0]} intensity={0.6} color="#ffd27a" distance={6} />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[30, 64]} />
      <meshStandardMaterial color="#0c1622" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

export function Car3DScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      className="!h-full !w-full"
      camera={{ position: [4.5, 2.6, 5.5], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0a0f17"]} />
      <fog attach="fog" args={["#0a0f17", 12, 28]} />
      <Lights />
      <CarModel />
      <Ground />
      <ScrollCamera progressRef={progressRef} />
    </Canvas>
  );
}
