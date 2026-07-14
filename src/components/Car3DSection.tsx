"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// WebGL canvas must not render on the server.
const Car3DScene = dynamic(
  () => import("./Car3DScene").then((m) => m.Car3DScene),
  { ssr: false, loading: () => <SceneFallback /> }
);

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-vw-dark text-white/60">
      <div className="animate-pulse text-sm">Loading 3D…</div>
    </div>
  );
}

const BEATS: { at: number; label: string }[] = [
  { at: 0.0, label: "Exterior" },
  { at: 0.4, label: "Step closer" },
  { at: 0.58, label: "Inside the cabin" },
  { at: 0.88, label: "Look around" },
  { at: 1.0, label: "Back outside" },
];

function beatFor(p: number) {
  let current = BEATS[0];
  for (const b of BEATS) {
    if (p >= b.at) current = b;
  }
  return current.label;
}

interface Car3DSectionProps {
  title?: string;
  subtitle?: string;
  scrollPages?: number;
  /** Accent color for the progress bar. */
  accent?: string;
}

export function Car3DSection({
  title = "Step inside",
  subtitle = "Scroll to dive into the cabin and back out.",
  scrollPages = 3,
  accent = "#ffd700",
}: Car3DSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState(BEATS[0].label);

  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      // Drive the camera ref every frame (cheap, no React re-render).
      progressRef.current = p;
      // Only update overlay state when it visibly changes.
      if (Math.abs(p - lastP) > 0.005) {
        lastP = p;
        setProgress(p);
        setLabel(beatFor(p));
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-vw-dark"
      style={{ height: `calc(100vh * ${scrollPages})` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Car3DScene progressRef={progressRef} />

        {/* Overlay UI */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
          <div className="max-w-xl">
            <span className="chip !bg-white/10 !text-ronaldo-gold">3D walk-through</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-2 text-white/70">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                key={label}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur"
              >
                {label}
              </span>
            </div>

            <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${progress * 100}%`, background: accent }}
              />
            </div>

            <p className="text-xs text-white/50">
              Keep scrolling to move through the car
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
