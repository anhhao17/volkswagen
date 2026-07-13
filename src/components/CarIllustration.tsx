import type { CarBodyType } from "@/lib/types";

type Props = {
  bodyType: CarBodyType;
  color: string;
  className?: string;
  spinWheels?: boolean;
};

/**
 * A clean, side-profile SVG car illustration that adapts its silhouette
 * to the body type. Wheels can optionally spin (for driving animations).
 */
export function CarIllustration({ bodyType, color, className, spinWheels = false }: Props) {
  const wheelClass = spinWheels ? "origin-center animate-wheel-spin" : "";
  const accent = "#001E50";

  return (
    <svg
      viewBox="0 0 360 160"
      className={className}
      role="img"
      aria-label={`${bodyType} car illustration`}
    >
      {/* Ground shadow */}
      <ellipse cx="180" cy="138" rx="140" ry="8" fill="rgba(0,30,80,0.12)" />

      {/* Body silhouette per type */}
      {renderBody(bodyType, color, accent)}

      {/* Windows */}
      {renderWindows(bodyType)}

      {/* Door line */}
      <line x1="180" y1="70" x2="180" y2="112" stroke={accent} strokeWidth="1.5" opacity="0.5" />

      {/* Headlight */}
      <path d="M322 96 Q330 96 332 102 L326 104 Q322 102 320 100 Z" fill="#FFE08A" />
      {/* Taillight */}
      <path d="M30 96 Q22 96 20 102 L26 104 Q30 102 32 100 Z" fill="#E03A3A" />

      {/* Wheels */}
      <Wheel cx={92} cy={120} className={wheelClass} />
      <Wheel cx={268} cy={120} className={wheelClass} />
    </svg>
  );
}

function renderBody(bodyType: CarBodyType, color: string, accent: string) {
  switch (bodyType) {
    case "Hatchback":
      return (
        <g>
          <path
            d="M40 112 L40 96 Q44 78 70 72 L120 60 Q150 50 180 50 Q210 50 240 60 L300 84 Q326 90 330 100 L330 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M40 112 L330 112 L330 120 L40 120 Z" fill={accent} opacity="0.85" />
        </g>
      );
    case "Sedan":
      return (
        <g>
          <path
            d="M30 112 L30 98 Q36 80 64 74 L120 60 Q160 48 200 48 Q236 48 270 60 L318 86 Q332 92 334 102 L334 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M30 112 L334 112 L334 120 L30 120 Z" fill={accent} opacity="0.85" />
        </g>
      );
    case "SUV":
      return (
        <g>
          <path
            d="M30 112 L30 92 Q36 70 64 64 L120 52 Q160 42 200 42 Q236 42 270 52 L318 78 Q334 84 336 96 L336 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M30 112 L336 112 L336 122 L30 122 Z" fill={accent} opacity="0.85" />
          {/* Roof rack */}
          <line x1="120" y1="44" x2="250" y2="44" stroke={accent} strokeWidth="3" opacity="0.6" />
        </g>
      );
    case "Coupe":
      return (
        <g>
          <path
            d="M30 112 L30 100 Q40 82 70 76 L130 58 Q170 44 210 44 Q244 44 276 56 L322 84 Q334 92 336 104 L336 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M30 112 L336 112 L336 120 L30 120 Z" fill={accent} opacity="0.85" />
        </g>
      );
    case "Estate":
      return (
        <g>
          <path
            d="M30 112 L30 96 Q36 78 64 72 L120 58 Q160 50 200 50 L300 50 Q330 54 334 70 L334 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M30 112 L334 112 L334 120 L30 120 Z" fill={accent} opacity="0.85" />
        </g>
      );
    case "EV":
      return (
        <g>
          <path
            d="M30 112 L30 94 Q38 74 66 68 L120 54 Q160 44 200 44 Q236 44 270 54 L318 80 Q334 86 336 98 L336 112 Z"
            fill={color}
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M30 112 L336 112 L336 122 L30 122 Z" fill={accent} opacity="0.85" />
          {/* EV accent strip */}
          <line x1="40" y1="104" x2="330" y2="104" stroke="#00B0F0" strokeWidth="2" opacity="0.7" />
        </g>
      );
    default:
      return null;
  }
}

function renderWindows(bodyType: CarBodyType) {
  const glass = "rgba(180, 220, 255, 0.55)";
  switch (bodyType) {
    case "Hatchback":
      return (
        <g fill={glass}>
          <path d="M120 64 L150 56 L210 56 L240 64 L240 84 L120 84 Z" />
        </g>
      );
    case "Sedan":
      return (
        <g fill={glass}>
          <path d="M120 62 L160 52 L210 52 L250 62 L250 84 L120 84 Z" />
        </g>
      );
    case "SUV":
      return (
        <g fill={glass}>
          <path d="M118 56 L160 46 L210 46 L256 56 L256 82 L118 82 Z" />
        </g>
      );
    case "Coupe":
      return (
        <g fill={glass}>
          <path d="M130 60 L170 48 L210 48 L246 60 L246 82 L130 82 Z" />
        </g>
      );
    case "Estate":
      return (
        <g fill={glass}>
          <path d="M120 60 L160 52 L300 52 L300 82 L120 82 Z" />
        </g>
      );
    case "EV":
      return (
        <g fill={glass}>
          <path d="M118 58 L160 48 L210 48 L256 58 L256 84 L118 84 Z" />
        </g>
      );
    default:
      return null;
  }
}

function Wheel({ cx, cy, className }: { cx: number; cy: number; className?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="20" fill="#0A0A0A" />
      <g className={className} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={cx} cy={cy} r="14" fill="#1A1A1A" stroke="#9AA0A6" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="6" fill="#9AA0A6" />
        {/* spokes */}
        <line x1={cx - 13} y1={cy} x2={cx + 13} y2={cy} stroke="#9AA0A6" strokeWidth="2" />
        <line x1={cx} y1={cy - 13} x2={cx} y2={cy + 13} stroke="#9AA0A6" strokeWidth="2" />
        <line x1={cx - 9.2} y1={cy - 9.2} x2={cx + 9.2} y2={cy + 9.2} stroke="#9AA0A6" strokeWidth="2" />
        <line x1={cx - 9.2} y1={cy + 9.2} x2={cx + 9.2} y2={cy - 9.2} stroke="#9AA0A6" strokeWidth="2" />
      </g>
    </g>
  );
}
