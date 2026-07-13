"use client";

import { useState } from "react";
import { SiuRunCelebration } from "./SiuRunCelebration";

/**
 * A floating "Siu!" button (bottom-right) that triggers the Ronaldo
 * celebration overlay on demand, anytime, on any page.
 */
export function SiuButton() {
  const [trigger, setTrigger] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const fire = () => {
    setTrigger((t) => t + 1);
    setShowOverlay(true);
    window.setTimeout(() => setShowOverlay(false), 3600);
  };

  return (
    <>
      {/* Full-screen celebration overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <SiuRunCelebration trigger={trigger} />
          </div>
          <button
            type="button"
            onClick={() => setShowOverlay(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Close
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={fire}
        aria-label="Trigger Ronaldo Siu celebration"
        className="fixed bottom-6 right-6 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-ronaldo-gold text-2xl font-black italic text-vw-dark shadow-xl ring-4 ring-white/40 transition hover:scale-110 hover:bg-ronaldo-gold-dark hover:text-white animate-pulse-glow"
      >
        Siu!
      </button>
    </>
  );
}
