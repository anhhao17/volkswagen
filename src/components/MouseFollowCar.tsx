"use client";

import { useEffect, useRef, useState } from "react";
import { CarIllustration } from "./CarIllustration";

/**
 * A tiny Volkswagen that follows the mouse around the screen.
 * Lagged with easing for a playful feel; wheels spin while moving,
 * and the car flips to face the direction it's travelling.
 *
 * Hilarious. Slightly annoying. Exactly what you asked for.
 */
export function MouseFollowCar() {
  const [enabled, setEnabled] = useState(true);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, t: 0 });
  const moving = useRef(false);
  const flip = useRef(false);

  const carRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const [spin, setSpin] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    // Hide on touch / small screens (no mouse).
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      setEnabled(false);
      return;
    }

    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      // Ease toward the target.
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      const dx = pos.current.x - last.current.x;
      const dy = pos.current.y - last.current.y;
      const dist = Math.hypot(dx, dy);
      const now = performance.now();
      const dt = now - last.current.t || 16;
      const speed = (dist / dt) * 1000; // px/s

      const isMoving = dist > 1.2;
      if (isMoving !== moving.current) {
        moving.current = isMoving;
        setSpin(isMoving);
      }
      if (dx < -1.5 && !flip.current) {
        flip.current = true;
        setFacingLeft(true);
      } else if (dx > 1.5 && flip.current) {
        flip.current = false;
        setFacingLeft(false);
      }

      last.current = { x: pos.current.x, y: pos.current.y, t: now };

      if (carRef.current) {
        // Offset so the car sits below-right of the cursor (not under it).
        carRef.current.style.transform = `translate3d(${pos.current.x + 14}px, ${pos.current.y + 10}px, 0) scaleX(${facingLeft ? -1 : 1})`;
      }
      if (speedRef.current) {
        speedRef.current.textContent = isMoving ? `${Math.round(Math.min(speed, 999))} px/s` : "idle";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, facingLeft]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden>
      {/* The car */}
      <div ref={carRef} className="absolute left-0 top-0 will-change-transform">
        <div className="relative">
          {/* tiny shadow */}
          <div className="absolute -bottom-1 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/20 blur-[2px]" />
          <CarIllustration
            bodyType="Hatchback"
            color="#001E50"
            spinWheels={spin}
            className="w-16 drop-shadow-[0_4px_6px_rgba(0,30,80,0.3)]"
          />
          {/* speedometer */}
          <span
            ref={speedRef}
            className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-vw-dark/80 px-2 py-0.5 text-[10px] font-bold text-ronaldo-gold"
          >
            idle
          </span>
        </div>
      </div>
    </div>
  );
}
