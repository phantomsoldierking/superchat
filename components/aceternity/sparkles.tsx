"use client"

import { useRef, useEffect } from "react"

interface SparklesProps {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
  particleOpacity?: number
}

export function SparklesCore({
  id = "sparkles",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  className,
  particleColor = "#FFF",
  particleOpacity = 0.5,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<any[]>([])
  const animationRef = useRef<number>()
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          canvas.width = width
          canvas.height = height
          initParticles()
        }
      }, 200)
    })

    resizeObserver.observe(canvas)

    const initParticles = () => {
      const { width, height } = canvas
      particles.current = []

      const particleCount = Math.min(Math.max(Math.floor((width * height) / 10000) * particleDensity, 50), 500)

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * particleOpacity,
        })
      }
    }

    const render = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = background

      particles.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      animationRef.current = requestAnimationFrame(render)
    }

    initParticles()
    render()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
    }
  }, [background, maxSize, minSize, particleColor, particleDensity, particleOpacity])

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  )
}
