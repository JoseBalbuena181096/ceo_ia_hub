import Image from 'next/image'

interface ViadLogoProps {
  className?: string
  color?: string
  full?: boolean
}

export function ViadLogo({ className, full = false }: ViadLogoProps) {
  return (
    <Image
      src="/viad.webp"
      alt="VIAD HUB"
      width={600}
      height={80}
      className={className}
      priority
    />
  )
}
