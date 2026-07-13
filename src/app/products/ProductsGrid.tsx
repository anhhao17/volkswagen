"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { cars } from "@/lib/cars";
import { CarCard } from "@/components/CarCard";
import type { CarBodyType } from "@/lib/types";

const bodyTypes: (CarBodyType | "All")[] = ["All", "Hatchback", "Sedan", "SUV", "EV", "Estate", "Coupe"];
const fuels = ["All", "Petrol", "Diesel", "Hybrid", "Electric"] as const;

export function ProductsGrid() {
  const searchParams = useSearchParams();
  const initialBody = (searchParams.get("bodyType") as CarBodyType | "All") ?? "All";

  const [body, setBody] = useState<CarBodyType | "All">(initialBody);
  const [fuel, setFuel] = useState<(typeof fuels)[number]>("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "power">("featured");

  const filtered = useMemo(() => {
    let list = cars.filter(
      (c) => (body === "All" || c.bodyType === body) && (fuel === "All" || c.fuel === fuel),
    );
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "power": list = [...list].sort((a, b) => b.horsepower - a.horsepower); break;
      default: break;
    }
    return list;
  }, [body, fuel, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <FilterGroup label="Body">
          {bodyTypes.map((b) => (
            <Chip key={b} active={body === b} onClick={() => setBody(b)}>{b}</Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Fuel">
          {fuels.map((f) => (
            <Chip key={f} active={fuel === f} onClick={() => setFuel(f)}>{f}</Chip>
          ))}
        </FilterGroup>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-vw-dark/60">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-vw-blue"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="power">Power</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-vw-dark/60">{filtered.length} car(s) found</p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-16 text-center">
          <p className="text-vw-dark/60">No cars match your filters.</p>
          <Link href="/products" className="btn-outline mt-4">Reset</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-vw-dark/40">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-vw-blue px-3 py-1 text-xs font-semibold text-white"
          : "rounded-full bg-vw-blue/10 px-3 py-1 text-xs font-medium text-vw-blue hover:bg-vw-blue/20"
      }
    >
      {children}
    </button>
  );
}
