'use client'

import { useEffect, useRef, useCallback } from 'react'

// VIAD brand colors — solid, not transparent party colors
const COLORS = [
  '#94c9ed',  // viad-blue
  '#c0b0d7',  // viad-lavender
  '#f4c0b5',  // viad-salmon
  '#87497a',  // viad-purple
  '#00205c',  // viad-navy
  '#e8eef6',  // light blue-gray
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  type: 0 | 1 | 2  // 0=circle, 1=square, 2=triangle
  depth: number     // fake 3D depth (0.5–1.5)
}

const CONFIG = {
  gravity: -0.05,        // negative = antigravity (float up)
  friction: 0.98,
  interactionRadius: 150,
  pushStrength: 4,
  speedFactor: 0.8,
}

export function FloatingElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)
  const dimsRef = useRef({ w: 0, h: 0 })

  const createParticle = useCallback((w: number, h: number, randomY: boolean): Particle => {
    const depth = Math.random() * 1 + 0.5
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 50,
      vx: (Math.random() - 0.5) * 2 * CONFIG.speedFactor,
      vy: (Math.random() - 0.5) * 2 * CONFIG.speedFactor - Math.random() * Math.abs(CONFIG.gravity),
      size: Math.random() * 15 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      type: Math.floor(Math.random() * 3) as 0 | 1 | 2,
      depth,
    }
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimsRef.current = { w, h }

      // Initialize particles — ~35 shapes, proportional to area
      const count = Math.min(Math.floor((w * h) / 25000), 40)
      const particles: Particle[] = []
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(w, h, true))
      }
      particlesRef.current = particles
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('touchmove', handleTouch)
    canvas.addEventListener('mouseleave', handleLeave)

    const animate = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)

      const mouse = mouseRef.current
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Antigravity — constant upward pull scaled by depth
        p.vy += CONFIG.gravity * 0.05 * p.depth

        // Movement scaled by depth (parallax)
        p.x += p.vx * p.depth
        p.y += p.vy * p.depth
        p.rotation += p.rotationSpeed

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CONFIG.interactionRadius && dist > 0) {
          const force = (CONFIG.interactionRadius - dist) / CONFIG.interactionRadius
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force * CONFIG.pushStrength
          p.vy += Math.sin(angle) * force * CONFIG.pushStrength
        }

        // Friction (air resistance)
        p.vx *= CONFIG.friction
        p.vy *= CONFIG.friction

        // Horizontal wrap
        if (p.x < -50) p.x = w + 50
        if (p.x > w + 50) p.x = -50

        // When floated off top → respawn at bottom
        if (p.y < -60) {
          particles[i] = createParticle(w, h, false)
          continue
        }

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color

        // Depth shadow for 3D feel
        ctx.shadowColor = 'rgba(0, 0, 0, 0.06)'
        ctx.shadowBlur = 10 * p.depth
        ctx.shadowOffsetX = 4
        ctx.shadowOffsetY = 4

        const s = p.size * p.depth

        ctx.beginPath()
        if (p.type === 0) {
          // Circle
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2)
        } else if (p.type === 1) {
          // Square
          ctx.rect(-s / 2, -s / 2, s, s)
        } else {
          // Triangle
          ctx.moveTo(0, -s / 2)
          ctx.lineTo(s / 2, s / 2)
          ctx.lineTo(-s / 2, s / 2)
          ctx.closePath()
        }
        ctx.fill()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('touchmove', handleTouch)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      aria-hidden="true"
    />
  )
}
