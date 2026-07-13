"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiuRunCelebration } from "@/components/SiuRunCelebration";
import { DrivingCar } from "@/components/DrivingCar";
import { formatPrice } from "@/lib/cars";
import type { Order } from "@/lib/types";

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [siuTrigger, setSiuTrigger] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("volw-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    // Fire the Siu celebration shortly after mount.
    const t = setTimeout(() => setSiuTrigger(1), 300);
    return () => clearTimeout(t);
  }, []);

  const carImage = order?.items?.[0]?.car.image ?? "/cars/golf-gti.jpg";

  return (
    <div className="container-page py-16 text-center">
      <div className="mx-auto max-w-2xl">
        <SiuRunCelebration trigger={siuTrigger} carImage={carImage} />
      </div>

      <h1 className="mt-6 text-4xl font-black tracking-tight text-vw-dark">
        Order confirmed! <span className="text-ronaldo-gold">SIUUUU!</span>
      </h1>
      <p className="mt-3 text-vw-dark/70">
        Thank you{order?.customer?.name ? `, ${order.customer.name}` : ""} — your Volkswagen is on its way.
      </p>

      {order && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-vw-dark/60">Order number</span>
            <span className="font-bold text-vw-blue">{order.id}</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map(({ car, quantity }) => (
              <li key={car.id} className="flex justify-between">
                <span className="text-vw-dark/70">{car.name} × {quantity}</span>
                <span>{formatPrice(car.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/5 pt-4">
            <span className="font-bold">Total paid</span>
            <span className="font-black text-vw-blue">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl bg-vw-blue/5 p-3">
        <DrivingCar bodyType="Coupe" color="#00B0F0" duration={5} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">Buy another</Link>
        <button type="button" onClick={() => setSiuTrigger((t) => t + 1)} className="btn-gold">
          Replay Siu
        </button>
      </div>
    </div>
  );
}
