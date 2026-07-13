"use client";

import { CarIllustration } from "./CarIllustration";
import type { CarBodyType } from "@/lib/types";

type Props = {
  bodyType?: CarBodyType;
  color?: string;
  className?: string;
  duration?: number;
};

/**
 * A car that drives across the screen on a road, with spinning wheels
 * and speed lines trailing behind. Used in the hero and as a divider.
 */
export function DrivingCar({
  bodyType = "Hatchback",
  color = "#001E50",
  className,
  duration = 6,
}: Props) {
  return (
    <div className={`relative h-40 w-full overflow-hidden ${className ?? ""}`}>
      {/* Road */}
      <div className="absolute bottom-6 left-0 right-0 h-1 dashed-road opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-vw-blue/5" />

      {/* Speed lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-16 rounded-full bg-vw-blue-light/60"
          style={{
            bottom: `${28 + i * 8}px`,
            left: 0,
            animation: `speed-line ${1 + i * 0.2}s linear infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      {/* The car */}
      <div
        className="absolute bottom-4 w-72"
        style={{
          animation: `drive-across ${duration}s linear infinite`,
        }}
      >
        <CarIllustration bodyType={bodyType} color={color} spinWheels className="w-full" />
      </div>
    </div>
  );
}
