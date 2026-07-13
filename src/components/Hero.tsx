"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DrivingCar } from "./DrivingCar";
import { SiuRunCelebration } from "./SiuRunCelebration";
import { SpeedLines } from "./SpeedLines";

export function Hero() {
  // Auto-play the Siu intro once on mount.
  const [siuTrigger, setSiuTrigger] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSiuTrigger(1), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-vw-dark text-white">
      <SpeedLines count={14} />
      {/* Glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-vw-blue-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-ronaldo-gold/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-fade-in-up">
          <span className="chip !bg-white/10 !text-ronaldo-gold">Volkswagen Official-Style Store</span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Drive the legend.
            <br />
            <span className="text-ronaldo-gold">SIUUU!</span>
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            From the iconic Golf GTI to the electric ID. Buzz — shop the full
            Volkswagen lineup online. Performance, heritage, and a celebration
            with every purchase.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-gold">
              Browse cars
            </Link>
            <button
              type="button"
              onClick={() => setSiuTrigger((t) => t + 1)}
              className="btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-vw-dark"
            >
              Replay Siu
            </button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
            <Stat value="8" label="Models" />
            <Stat value="320hp" label="Top power" />
            <Stat value="546km" label="EV range" />
          </dl>
        </div>

        {/* Siu celebration + driving car scene */}
        <div className="relative">
          <SiuRunCelebration trigger={siuTrigger} autoPlay={false} className="border border-white/10" />
          <div className="mt-3 overflow-hidden rounded-2xl bg-white/5 p-3 backdrop-blur">
            <DrivingCar bodyType="Hatchback" color="#00B0F0" duration={5} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-3">
      <dt className="text-2xl font-black text-ronaldo-gold">{value}</dt>
      <dd className="text-xs uppercase tracking-wider text-white/50">{label}</dd>
    </div>
  );
}
