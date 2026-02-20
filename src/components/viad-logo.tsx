interface ViadLogoProps {
  className?: string
  color?: string
}

export function ViadLogo({ className, color = "currentColor" }: ViadLogoProps) {
  return (
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="VIAD"
    >
      {/* V */}
      <path
        d="M10 10 L40 70 L70 10"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* I */}
      <path
        d="M95 10 L95 70"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      {/* A (lambda style, no crossbar) */}
      <path
        d="M130 70 L160 10 L190 70"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* D (organic rounded) */}
      <path
        d="M220 10 L220 70 M220 10 C270 10, 270 70, 220 70"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
