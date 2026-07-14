"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { X, Car as CarIcon, Eye, LogIn, RotateCcw, Box } from "lucide-react";
import * as THREE from "three";
import { buildVWBeetle } from "./VWBeetleModel";
import { sampleKeyframes, beatFor, BEATS } from "./car3dKeyframes";

/* ----------------------------- 3D scene ----------------------------- */

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

function SliderCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.5, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    sampleKeyframes(progressRef.current, tmpPos.current, tmpTarget.current);
    camera.position.lerp(tmpPos.current, 0.1);
    target.current.lerp(tmpTarget.current, 0.1);
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

function ViewerCanvas({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
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
      <SliderCamera progressRef={progressRef} />
    </Canvas>
  );
}

/* --------------------------- Modal wrapper --------------------------- */

interface Car3DViewerProps {
  open: boolean;
  onClose: () => void;
  carName?: string;
}

const QUICK_BUTTONS: { at: number; label: string; icon: React.ReactNode }[] = [
  { at: 0.0, label: "Exterior", icon: <CarIcon size={16} /> },
  { at: 0.4, label: "Step closer", icon: <Eye size={16} /> },
  { at: 0.58, label: "Inside cabin", icon: <LogIn size={16} /> },
  { at: 0.88, label: "Look around", icon: <RotateCcw size={16} /> },
  { at: 1.0, label: "Back outside", icon: <Box size={16} /> },
];

export function Car3DViewer({ open, onClose, carName }: Car3DViewerProps) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState(BEATS[0].label);

  // Lock body scroll while modal is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset to exterior each time the modal opens.
  useEffect(() => {
    if (open) {
      progressRef.current = 0;
      setProgress(0);
      setLabel(BEATS[0].label);
    }
  }, [open]);

  const setP = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    progressRef.current = clamped;
    setProgress(clamped);
    setLabel(beatFor(clamped));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-vw-dark/95 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <span className="chip !bg-white/10 !text-ronaldo-gold">3D walk-through</span>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
            {carName ? `${carName} — ` : ""}Inside & out
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white hover:text-vw-dark"
          aria-label="Close 3D viewer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Canvas */}
      <div className="relative flex-1">
        <ViewerCanvas progressRef={progressRef} />

        {/* Beat label overlay */}
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
          <span
            key={label}
            className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur"
          >
            {label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-5">
        {/* Quick jump buttons */}
        <div className="mx-auto mb-4 flex max-w-2xl flex-wrap justify-center gap-2">
          {QUICK_BUTTONS.map((b) => {
            const active = Math.abs(progress - b.at) < 0.05;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => setP(b.at)}
                className={
                  active
                    ? "inline-flex items-center gap-1.5 rounded-full bg-ronaldo-gold px-3 py-1.5 text-xs font-bold text-vw-dark"
                    : "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20"
                }
              >
                {b.icon}
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Slider */}
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="text-xs font-medium text-white/60">Exterior</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => setP(parseFloat(e.target.value))}
            className="car3d-slider flex-1"
          />
          <span className="text-xs font-medium text-white/60">Inside</span>
        </div>
        <p className="mt-2 text-center text-xs text-white/40">
          Drag the slider or tap a button to move through the car · Esc to close
        </p>
      </div>
    </div>
  );
}

/* ------------------------- Trigger button ------------------------- */

interface Car3DButtonProps {
  carName?: string;
  className?: string;
}

export function Car3DButton({ carName, className }: Car3DButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-full border border-vw-blue/30 bg-vw-blue/5 px-5 py-2.5 text-sm font-semibold text-vw-blue transition hover:border-vw-blue hover:bg-vw-blue hover:text-white"
        }
      >
        <Box size={16} />
        View in 3D
      </button>
      <Car3DViewer open={open} onClose={() => setOpen(false)} carName={carName} />
    </>
  );
}
