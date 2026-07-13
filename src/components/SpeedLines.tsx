"use client";

type Props = {
  count?: number;
  className?: string;
};

/** Decorative horizontal speed lines for backgrounds. */
export function SpeedLines({ count = 8, className }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute h-px w-24 rounded-full bg-white/20"
          style={{
            top: `${(i * 100) / count}%`,
            left: 0,
            animation: `speed-line ${2 + (i % 3)}s linear infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
