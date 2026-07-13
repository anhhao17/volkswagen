"use client";

import { useState } from "react";
import { SiuRunCelebration } from "./SiuRunCelebration";
import { MessiCelebration } from "./MessiCelebration";

type Mode = "ronaldo" | "messi";

/**
 * Two floating buttons (bottom-right): "Siu!" (Ronaldo) and "GOAT!" (Messi).
 * Each triggers its own full-screen celebration overlay on demand.
 */
export function SiuButton() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [trigger, setTrigger] = useState(0);

  const fire = (m: Mode) => {
    setMode(m);
    setTrigger((t) => t + 1);
    window.setTimeout(() => setMode(null), 4200);
  };

  return (
    <>
      {/* Full-screen celebration overlay */}
      {mode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            {mode === "ronaldo" ? (
              <SiuRunCelebration trigger={trigger} />
            ) : (
              <MessiCelebration trigger={trigger} />
            )}
          </div>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Close
          </button>
        </div>
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => fire("messi")}
          aria-label="Trigger Messi Ankara celebration"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 text-sm font-black italic text-sky-900 shadow-xl ring-4 ring-white/40 transition hover:scale-110 hover:bg-sky-300 animate-pulse-glow"
        >
          GOAT!
        </button>
        <button
          type="button"
          onClick={() => fire("ronaldo")}
          aria-label="Trigger Ronaldo Siu celebration"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-ronaldo-gold text-2xl font-black italic text-vw-dark shadow-xl ring-4 ring-white/40 transition hover:scale-110 hover:bg-ronaldo-gold-dark hover:text-white animate-pulse-glow"
        >
          Siu!
        </button>
      </div>
    </>
  );
}
