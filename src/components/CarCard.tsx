"use client";

import Link from "next/link";
import { Gauge, Fuel, Zap, Users } from "lucide-react";
import type { Car } from "@/lib/types";
import { CarImage } from "./CarImage";
import { formatPrice } from "@/lib/cars";
import { useCart } from "./CartProvider";

export function CarCard({ car }: { car: Car }) {
  const { add } = useCart();

  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link href={`/products/${car.slug}`} className="relative block">
        <div className="relative h-48 overflow-hidden bg-vw-blue/5">
          <CarImage
            src={car.image}
            alt={car.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {car.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-ronaldo-gold px-3 py-1 text-xs font-bold text-vw-dark">
              {car.badge}
            </span>
          )}
          {!car.inStock && (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-vw-dark">{car.name}</h3>
            <p className="text-xs text-vw-dark/50">
              {car.year} · {car.bodyType} · {car.fuel}
            </p>
          </div>
          <span className="chip">{car.rating} ★</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-vw-dark/70">
          <Spec icon={<Gauge size={14} />} label={`${car.horsepower} hp`} />
          <Spec icon={<Zap size={14} />} label={`0-100 in ${car.zeroToHundred}s`} />
          <Spec icon={<Fuel size={14} />} label={`${car.range} km`} />
          <Spec icon={<Users size={14} />} label={`${car.seats} seats`} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-black text-vw-blue">{formatPrice(car.price)}</span>
          <div className="flex gap-2">
            <Link href={`/products/${car.slug}`} className="btn-outline !px-4 !py-2">
              Details
            </Link>
            <button
              type="button"
              disabled={!car.inStock}
              onClick={() => add(car)}
              className="btn-primary !px-4 !py-2"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-vw-blue">{icon}</span>
      {label}
    </span>
  );
}
