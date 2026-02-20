interface ViadLogoProps {
  className?: string
  color?: string
  full?: boolean
}

export function ViadLogo({ className, color = "currentColor", full = false }: ViadLogoProps) {
  const common = {
    stroke: color,
    strokeWidth: 12,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  }

  if (full) {
    return (
      <svg
        viewBox="0 0 668 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="VIAD HUB IA"
      >
        {/* V */}
        <path d="M10 10 L40 70 L70 10" {...common} />
        {/* I */}
        <path d="M95 10 L95 70" {...common} />
        {/* A (lambda, no crossbar) */}
        <path d="M130 70 L160 10 L190 70" {...common} />
        {/* D (organic rounded) */}
        <path d="M220 10 L220 70 M220 10 C270 10, 270 70, 220 70" {...common} />

        {/* H */}
        <path d="M320 10 L320 70 M370 10 L370 70 M320 40 L370 40" {...common} />
        {/* U */}
        <path d="M400 10 L400 55 C400 72, 450 72, 450 55 L450 10" {...common} />
        {/* B */}
        <path d="M480 10 L480 70 M480 10 C515 10, 515 40, 480 40 C520 40, 520 70, 480 70" {...common} />

        {/* I */}
        <path d="M560 10 L560 70" {...common} />
        {/* A (lambda, no crossbar) */}
        <path d="M595 70 L625 10 L655 70" {...common} />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="VIAD"
    >
      {/* V */}
      <path d="M10 10 L40 70 L70 10" {...common} />
      {/* I */}
      <path d="M95 10 L95 70" {...common} />
      {/* A (lambda, no crossbar) */}
      <path d="M130 70 L160 10 L190 70" {...common} />
      {/* D (organic rounded) */}
      <path d="M220 10 L220 70 M220 10 C270 10, 270 70, 220 70" {...common} />
    </svg>
  )
}
