'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  shape: 'circle' | 'ring' | 'square' | 'dot'
  rotation: number
  rotationSpeed: number
  drift: number
  phase: number
}

const COLORS = [
  'rgba(148, 201, 237, alpha)',  // viad-blue
  'rgba(192, 176, 215, alpha)',  // viad-lavender
  'rgba(244, 192, 181, alpha)',  // viad-salmon
  'rgba(135, 73, 122, alpha)',   // viad-purple
  'rgba(0, 32, 92, alpha)',      // viad-navy (subtle)
]

const SHAPES: Particle['shape'][] = ['circle', 'ring', 'square', 'dot', 'circle', 'ring', 'dot']

export function FloatingElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 18000), 50)
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const colorTemplate = COLORS[Math.floor(Math.random() * COLORS.length)]
      const baseOpacity = 0.12 + Math.random() * 0.25
      const color = colorTemplate.replace('alpha', baseOpacity.toString())

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.35, // float upward (antigravity)
        size: 4 + Math.random() * 28,
        opacity: baseOpacity,
        color,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        drift: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      })
    }

    particlesRef.current = particles
  }, [])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)

    switch (p.shape) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        break

      case 'ring':
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1.5
        ctx.stroke()
        break

      case 'square': {
        const half = p.size / 2.5
        ctx.fillStyle = p.color
        ctx.fillRect(-half, -half, half * 2, half * 2)
        break
      }

      case 'dot':
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        break
    }

    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
      initParticles(w, h)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight

      ctx.clearRect(0, 0, w, h)
      timeRef.current += 0.01

      const mouse = mouseRef.current
      const particles = particlesRef.current

      for (const p of particles) {
        // Sinusoidal drift (organic feel)
        const driftX = Math.sin(timeRef.current * p.drift + p.phase) * 0.4
        const driftY = Math.cos(timeRef.current * p.drift * 0.7 + p.phase) * 0.2

        // Mouse interaction — gentle repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        let pushX = 0
        let pushY = 0

        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150
          const ease = force * force * 0.8
          pushX = (dx / dist) * ease
          pushY = (dy / dist) * ease
        }

        // Update position
        p.x += p.vx + driftX + pushX
        p.y += p.vy + driftY + pushY
        p.rotation += p.rotationSpeed

        // Wrap around edges with padding
        const pad = p.size + 10
        if (p.y < -pad) p.y = h + pad
        if (p.y > h + pad) p.y = -pad
        if (p.x < -pad) p.x = w + pad
        if (p.x > w + pad) p.x = -pad

        drawParticle(ctx, p)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [initParticles, drawParticle])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      aria-hidden="true"
    />
  )
}
