"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Phase = "idle" | "run" | "squash" | "jump" | "land" | "siu" | "done";

type Props = {
  /** Increment or toggle to replay. */
  trigger: number | boolean;
  /** Auto-play once on mount. */
  autoPlay?: boolean;
  /** Car photo to drive in (path under /public). */
  carImage?: string;
  className?: string;
};

const WORD = ["S", "I", "U", "U", "U", "U"];

/**
 * Recreates the ~/.claude/siu.sh celebration on the web:
 *   1. A car drives in from the left edge
 *   2. A figure runs in from the left (alternating leg poses)
 *   3. Squash (crouch)
 *   4. Stretch (jump up)
 *   5. Land with arms spread wide
 *   6. "SIUUUU" types in letter-by-letter, left to right
 *   7. Hold the pose + "CALMA! 🐐"
 *
 * Plays whenever `trigger` changes (and optionally on mount).
 */
export function SiuRunCelebration({
  trigger,
  autoPlay = false,
  carImage = "/cars/golf-gti.jpg",
  className,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [siuCount, setSiuCount] = useState(0); // how many letters of SIUUUU are visible
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = () => {
    clearTimers();
    setSiuCount(0);
    setPhase("run");

    // Timing mirrors siu.sh roughly: run in (~1s), squash 0.35, jump 0.3+0.25, land 0.35,
    // then SIUUUU types one letter every ~0.16s, then hold.
    const t = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

    t(1000, () => setPhase("squash"));
    t(1350, () => setPhase("jump"));
    t(1650, () => setPhase("jump"));
    t(1900, () => setPhase("land"));
    // SIUUUU types in
    t(2200, () => setPhase("siu"));
    WORD.forEach((_, i) => t(2360 + i * 160, () => setSiuCount(i + 1)));
    t(2360 + WORD.length * 160 + 400, () => setPhase("done"));
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
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-vw-dark to-vw-blue text-white ${className ?? ""}`}
      style={{ height: 320 }}
      aria-hidden={!active}
    >
      {/* Starfield / speed backdrop */}
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

      {/* Ground / road */}
      <div className="absolute bottom-10 left-0 right-0 h-1 dashed-road opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/30" />

      {/* The car driving in from the left */}
      <CarRunner image={carImage} running={phase === "run"} stopped={phase !== "run" && phase !== "idle"} />

      {/* The figure doing the Siu */}
      <FigureRunner phase={phase} />

      {/* SIUUUU typing in, left to right */}
      {(phase === "siu" || phase === "done") && (
        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
          <div className="flex items-end gap-3">
            {WORD.map((l, i) => (
              <span
                key={i}
                className="text-5xl font-black italic tracking-tight text-ronaldo-gold drop-shadow-[0_3px_0_rgba(0,0,0,0.5)] sm:text-6xl"
                style={{
                  fontFamily: "var(--font-display)",
                  opacity: i < siuCount ? 1 : 0,
                  transform: i < siuCount ? "scale(1)" : "scale(0.5)",
                  transition: "opacity 0.12s ease-out, transform 0.12s ease-out",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CALMA! 🐐 */}
      {phase === "done" && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-fade-in-up">
          <span className="text-lg font-bold italic text-ronaldo-gold">CALMA! 🐐</span>
        </div>
      )}

      {/* Idle hint */}
      {phase === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-white/50">Press to SIUUU</span>
        </div>
      )}
    </div>
  );
}

/* ---------- car that drives in from the left ---------- */
function CarRunner({ image, running, stopped }: { image: string; running: boolean; stopped: boolean }) {
  // During 'run': slide from -40% to the middle (50%) over ~1s.
  // When stopped: hold position with a subtle brake lean.
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
      {/* motion lines behind the car while running */}
      {running && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 pr-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-10 rounded-full bg-ronaldo-gold/80"
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

/* ---------- figure: run / squash / jump / land ---------- */
function FigureRunner({ phase }: { phase: Phase }) {
  // Horizontal position: run in from left to ~38% (beside/behind car), then stay.
  const running = phase === "run";
  const x = phase === "idle" ? "-20%" : "38%";

  // Vertical offset for jump phases.
  let y = 0;
  if (phase === "jump") y = -70;
  if (phase === "land" || phase === "siu" || phase === "done") y = 0;

  // Pose selector.
  const pose =
    phase === "squash"
      ? "squash"
      : phase === "jump"
        ? "stretch"
        : phase === "land" || phase === "siu" || phase === "done"
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
      {/* Running leg alternation via two swapped sub-poses */}
      {pose === "run" ? (
        <RunningFigure />
      ) : (
        <PoseFigure pose={pose as "squash" | "stretch" | "landed"} />
      )}
    </div>
  );
}

/** Alternating leg frames while running, toggled on an interval. */
function RunningFigure() {
  const [frame, setFrame] = useState<0 | 1>(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f ? 0 : 1)), 110);
    return () => clearInterval(id);
  }, []);
  return <PoseFigure pose="run" runFrame={frame} />;
}

/**
 * Stylised Ronaldo-ish figure in SVG. Poses mirror siu.sh:
 *   run   — legs alternating (runFrame 0/1)
 *   squash— crouched, compressed
 *   stretch— tall, arms up, mid-jump
 *   landed— arms spread wide, the celebration
 */
function PoseFigure({
  pose,
  runFrame = 0,
}: {
  pose: "run" | "squash" | "stretch" | "landed";
  runFrame?: 0 | 1;
}) {
  const skin = "#E8B98A";
  const jersey = "#FFFFFF";
  const line = "#001E50";
  const shorts = "#001E50";

  // Arm rotation for landed (spread wide) vs stretch (up).
  const leftArm =
    pose === "landed" ? "rotate(45deg)" : pose === "stretch" ? "rotate(-150deg)" : "rotate(10deg)";
  const rightArm =
    pose === "landed" ? "rotate(-45deg)" : pose === "stretch" ? "rotate(150deg)" : "rotate(-10deg)";

  // Squash: compress vertically.
  const scaleY = pose === "squash" ? 0.7 : pose === "stretch" ? 1.15 : 1;

  // Running legs: alternate.
  const legA = pose === "run" && runFrame === 0 ? "rotate(20deg)" : pose === "run" ? "rotate(-15deg)" : "rotate(0deg)";
  const legB = pose === "run" && runFrame === 0 ? "rotate(-15deg)" : pose === "run" ? "rotate(20deg)" : "rotate(0deg)";

  return (
    <svg
      viewBox="0 0 120 200"
      width="90"
      height="150"
      style={{ transform: `scaleY(${scaleY})`, transformOrigin: "bottom center", overflow: "visible" }}
    >
      {/* shadow */}
      <ellipse cx="60" cy="196" rx="34" ry="5" fill="rgba(0,0,0,0.35)" />

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

      {/* Torso / jersey */}
      <path d="M38 70 L82 70 L78 116 L42 116 Z" fill={jersey} stroke={line} strokeWidth="2" />
      <text x="60" y="100" textAnchor="middle" fontSize="20" fontWeight="900" fill={line} fontFamily="var(--font-display)">
        7
      </text>

      {/* Arms */}
      <g style={{ transformOrigin: "40px 78px", transform: leftArm, transition: "transform 0.25s ease-out" }}>
        <rect x="28" y="76" width="12" height="44" rx="5" fill={jersey} stroke={line} strokeWidth="2" />
        <circle cx="34" cy="122" r="6" fill={skin} />
      </g>
      <g style={{ transformOrigin: "80px 78px", transform: rightArm, transition: "transform 0.25s ease-out" }}>
        <rect x="80" y="76" width="12" height="44" rx="5" fill={jersey} stroke={line} strokeWidth="2" />
        <circle cx="86" cy="122" r="6" fill={skin} />
      </g>

      {/* Neck */}
      <rect x="54" y="60" width="12" height="12" fill={skin} />

      {/* Head */}
      <circle cx="60" cy="48" r="16" fill={skin} />
      {/* Hair */}
      <path d="M44 46 Q46 30 60 28 Q74 30 76 46 Q72 38 60 36 Q48 38 44 46 Z" fill="#2A1A12" />
      {/* Face */}
      <circle cx="54" cy="50" r="1.6" fill="#0A0A0A" />
      <circle cx="66" cy="50" r="1.6" fill="#0A0A0A" />
      <path d="M54 56 Q60 59 66 56" stroke="#0A0A0A" strokeWidth="1.3" fill="none" />
    </svg>
  );
}
