"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Phase = "idle" | "run" | "squash" | "jump" | "land" | "chant" | "done";

type Props = {
  trigger: number | boolean;
  autoPlay?: boolean;
  carImage?: string;
  className?: string;
};

// The iconic Ankara Messi chant, broken into lines that type in one-by-one.
const CHANT = [
  "ANKARA MESSI",
  "KARA MESSI",
  "ENCARA MESSI!",
  "MESSI MESSI MESSI",
  "GOL! GOL! GOL!",
];

/**
 * Messi's iconic "point to the sky" celebration, with the Ankara Messi chant.
 *
 * Sequence:
 *   1. A car drives in from the left (carrying the moment)
 *   2. Messi runs in dribbling a ball (alternating legs)
 *   3. Squash (crouch, loading the jump)
 *   4. Stretch (small hop)
 *   5. Land pointing to the sky — right arm straight up, head looking up
 *      (his tribute to his grandmother)
 *   6. "ANKARA MESSI / KARA MESSI / ENCARA MESSI! / MESSI MESSI MESSI / GOL! GOL! GOL!"
 *      types in line-by-line
 *   7. Hold + "🐐 GOAT"
 */
export function MessiCelebration({
  trigger,
  autoPlay = false,
  carImage = "/cars/id-buzz.jpg",
  className,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [chantIndex, setChantIndex] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = () => {
    clearTimers();
    setChantIndex(0);
    setPhase("run");

    const t = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

    t(1000, () => setPhase("squash"));
    t(1350, () => setPhase("jump"));
    t(1650, () => setPhase("jump"));
    t(1900, () => setPhase("land"));
    t(2200, () => setPhase("chant"));
    CHANT.forEach((_, i) => t(2360 + i * 420, () => setChantIndex(i + 1)));
    t(2360 + CHANT.length * 420 + 400, () => setPhase("done"));
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(play, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  useEffect(() => {
    if (trigger === 0) return;
    play();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => () => clearTimers(), []);

  const active = phase !== "idle";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900 to-sky-700 text-white ${className ?? ""}`}
      style={{ height: 320 }}
      aria-hidden={!active}
    >
      {/* Pitch / sky backdrop with subtle stars */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-px w-20 rounded-full bg-white/30"
            style={{
              top: `${(i * 6) % 90}%`,
              left: 0,
              animation: active ? `speed-line ${1.4 + (i % 3) * 0.3}s linear infinite` : "none",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Ground / pitch */}
      <div className="absolute bottom-10 left-0 right-0 h-1 bg-white/40" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/30" />

      {/* The car driving in from the left */}
      <CarRunner image={carImage} running={phase === "run"} stopped={phase !== "run" && phase !== "idle"} />

      {/* Messi figure */}
      <FigureRunner phase={phase} />

      {/* Ankara Messi chant typing in */}
      {(phase === "chant" || phase === "done") && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 space-y-1 text-center">
          {CHANT.map((line, i) => (
            <div
              key={i}
              className="text-2xl font-black italic tracking-tight text-ronaldo-gold drop-shadow-[0_3px_0_rgba(0,0,0,0.5)] sm:text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                opacity: i < chantIndex ? 1 : 0,
                transform: i < chantIndex ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                lineHeight: i === CHANT.length - 1 ? 1.4 : 1.1,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* GOAT 🐐 */}
      {phase === "done" && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-fade-in-up">
          <span className="text-lg font-bold italic text-white">🐐 GOAT</span>
        </div>
      )}

      {/* Idle hint */}
      {phase === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-white/50">Press for Ankara Messi</span>
        </div>
      )}
    </div>
  );
}

/* ---------- car that drives in from the left ---------- */
function CarRunner({ image, running, stopped }: { image: string; running: boolean; stopped: boolean }) {
  return (
    <div
      className="absolute bottom-10 h-24 w-44"
      style={{
        left: running ? "50%" : stopped ? "50%" : "-40%",
        transform: stopped ? "translateX(-100%) rotate(-1deg)" : "translateX(-100%)",
        transition: running
          ? "left 1s cubic-bezier(0.3,0.8,0.4,1)"
          : stopped
            ? "transform 0.2s ease-out"
            : "none",
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={image}
          alt="Volkswagen driving in"
          fill
          sizes="176px"
          className="object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
        />
      </div>
      {running && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 pr-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-10 rounded-full bg-sky-300/80"
              style={{
                top: `${-12 + i * 8}px`,
                right: 0,
                animation: `speed-line 0.5s linear infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- figure: run / squash / jump / land (point to sky) ---------- */
function FigureRunner({ phase }: { phase: Phase }) {
  const running = phase === "run";
  const x = phase === "idle" ? "-20%" : "38%";
  let y = 0;
  if (phase === "jump") y = -60;
  if (phase === "land" || phase === "chant" || phase === "done") y = 0;

  const pose =
    phase === "squash"
      ? "squash"
      : phase === "jump"
        ? "stretch"
        : phase === "land" || phase === "chant" || phase === "done"
          ? "landed"
          : "run";

  return (
    <div
      className="absolute bottom-10"
      style={{
        left: x,
        transform: `translateX(-50%) translateY(${y}px)`,
        transition: running
          ? "left 1s cubic-bezier(0.3,0.8,0.4,1)"
          : "left 0.2s ease-out, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {pose === "run" ? <RunningFigure /> : <PoseFigure pose={pose as "squash" | "stretch" | "landed"} />}
    </div>
  );
}

function RunningFigure() {
  const [frame, setFrame] = useState<0 | 1>(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f ? 0 : 1)), 110);
    return () => clearInterval(id);
  }, []);
  return <PoseFigure pose="run" runFrame={frame} />;
}

/**
 * Stylised Messi figure in SVG. Poses:
 *   run    — legs alternating, ball at feet
 *   squash — crouched
 *   stretch— small hop
 *   landed — pointing to the sky (right arm straight up, head tilted up)
 */
function PoseFigure({
  pose,
  runFrame = 0,
}: {
  pose: "run" | "squash" | "stretch" | "landed";
  runFrame?: 0 | 1;
}) {
  const skin = "#E8B98A";
  const jersey = "#ADD8E6"; // Argentina light blue
  const line = "#0A3D62";
  const shorts = "#0A3D62";

  // Pointing to sky: right arm straight up, left arm relaxed.
  const leftArm =
    pose === "landed" ? "rotate(15deg)" : pose === "stretch" ? "rotate(-30deg)" : "rotate(10deg)";
  const rightArm =
    pose === "landed" ? "rotate(-170deg)" : pose === "stretch" ? "rotate(140deg)" : "rotate(-10deg)";

  const scaleY = pose === "squash" ? 0.7 : pose === "stretch" ? 1.12 : 1;

  const legA = pose === "run" && runFrame === 0 ? "rotate(20deg)" : pose === "run" ? "rotate(-15deg)" : "rotate(0deg)";
  const legB = pose === "run" && runFrame === 0 ? "rotate(-15deg)" : pose === "run" ? "rotate(20deg)" : "rotate(0deg)";

  // Head tilt up when pointing to sky.
  const headTilt = pose === "landed" ? "rotate(-15deg)" : "rotate(0deg)";

  return (
    <svg
      viewBox="0 0 120 200"
      width="90"
      height="150"
      style={{ transform: `scaleY(${scaleY})`, transformOrigin: "bottom center", overflow: "visible" }}
    >
      {/* shadow */}
      <ellipse cx="60" cy="196" rx="34" ry="5" fill="rgba(0,0,0,0.35)" />

      {/* Football at feet while running */}
      {pose === "run" && (
        <circle cx={runFrame === 0 ? 80 : 40} cy="190" r="7" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
      )}

      {/* Legs */}
      <g style={{ transformOrigin: "50px 150px", transform: legA, transition: "transform 0.1s" }}>
        <rect x="44" y="120" width="12" height="40" rx="4" fill={shorts} />
        <rect x="44" y="158" width="12" height="34" rx="3" fill={skin} />
        <ellipse cx="50" cy="194" rx="10" ry="4" fill="#0A0A0A" />
      </g>
      <g style={{ transformOrigin: "70px 150px", transform: legB, transition: "transform 0.1s" }}>
        <rect x="64" y="120" width="12" height="40" rx="4" fill={shorts} />
        <rect x="64" y="158" width="12" height="34" rx="3" fill={skin} />
        <ellipse cx="70" cy="194" rx="10" ry="4" fill="#0A0A0A" />
      </g>

      {/* Shorts waist */}
      <rect x="40" y="112" width="40" height="14" rx="4" fill={shorts} />

      {/* Torso / jersey (Argentina light blue with white stripes hint) */}
      <path d="M38 70 L82 70 L78 116 L42 116 Z" fill={jersey} stroke={line} strokeWidth="2" />
      {/* subtle stripes */}
      <line x1="50" y1="72" x2="48" y2="114" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
      <line x1="70" y1="72" x2="72" y2="114" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
      {/* number 10 */}
      <text x="60" y="100" textAnchor="middle" fontSize="18" fontWeight="900" fill={line} fontFamily="var(--font-display)">
        10
      </text>

      {/* Arms */}
      <g style={{ transformOrigin: "40px 78px", transform: leftArm, transition: "transform 0.25s ease-out" }}>
        <rect x="28" y="76" width="12" height="44" rx="5" fill={jersey} stroke={line} strokeWidth="2" />
        <circle cx="34" cy="122" r="6" fill={skin} />
      </g>
      {/* Right arm — points straight up when landed */}
      <g style={{ transformOrigin: "80px 78px", transform: rightArm, transition: "transform 0.3s ease-out" }}>
        <rect x="80" y="76" width="12" height="44" rx="5" fill={jersey} stroke={line} strokeWidth="2" />
        <circle cx="86" cy="122" r="6" fill={skin} />
        {/* pointing finger when landed */}
        {pose === "landed" && (
          <rect x="84" y="116" width="4" height="10" rx="2" fill={skin} transform="translate(0 -44)" />
        )}
      </g>

      {/* Neck */}
      <rect x="54" y="60" width="12" height="12" fill={skin} />

      {/* Head (tilts up when pointing to sky) */}
      <g style={{ transformOrigin: "60px 48px", transform: headTilt, transition: "transform 0.3s ease-out" }}>
        <circle cx="60" cy="48" r="16" fill={skin} />
        {/* Hair (longer, brown) */}
        <path d="M44 48 Q44 28 60 28 Q76 28 76 48 Q74 40 70 38 L70 50 Q66 34 60 34 Q54 34 50 50 L50 38 Q46 40 44 48 Z" fill="#3A2317" />
        {/* Face — when pointing up, eyes look up (closed/simple) */}
        {pose === "landed" ? (
          <>
            <circle cx="54" cy="46" r="1.4" fill="#0A0A0A" />
            <circle cx="66" cy="46" r="1.4" fill="#0A0A0A" />
            <path d="M54 54 Q60 52 66 54" stroke="#0A0A0A" strokeWidth="1.2" fill="none" />
          </>
        ) : (
          <>
            <circle cx="54" cy="50" r="1.6" fill="#0A0A0A" />
            <circle cx="66" cy="50" r="1.6" fill="#0A0A0A" />
            <path d="M54 56 Q60 58 66 56" stroke="#0A0A0A" strokeWidth="1.3" fill="none" />
          </>
        )}
      </g>
    </svg>
  );
}
