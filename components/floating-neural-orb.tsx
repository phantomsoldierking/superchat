"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"

export function FloatingNeuralOrb() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    if (!orb) return

    let mouseX = 0
    let mouseY = 0
    let orbX = 0
    let orbY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      orbX += (mouseX - orbX) * 0.02
      orbY += (mouseY - orbY) * 0.02

      orb.style.transform = `translate(${orbX * 0.05}px, ${orbY * 0.05}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed top-8 left-8 z-20">
      <div ref={orbRef} className="relative w-20 h-20 transition-transform duration-1000 ease-out">
        {/* Main Orb */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-spin-slow">
          <div className="absolute inset-1 rounded-full bg-black">
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-blue-400/50 animate-pulse">
              <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-purple-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -inset-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status Badge */}
      <Badge variant="outline" className="mt-4 border-purple-500/30 text-purple-300 bg-black/50 backdrop-blur-sm">
        Connected to your thoughts...
      </Badge>
    </div>
  )
}
