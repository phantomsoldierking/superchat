"use client"

import { useEffect, useRef } from "react"

export function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = container.querySelectorAll(".floating-element")

    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement
      const delay = index * 0.5
      const duration = 3 + Math.random() * 2

      htmlElement.style.animationDelay = `${delay}s`
      htmlElement.style.animationDuration = `${duration}s`
    })
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Geometric Shapes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="floating-element absolute opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationName: "float-random",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          {i % 4 === 0 && <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />}
          {i % 4 === 1 && <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rotate-45" />}
          {i % 4 === 2 && <div className="w-2 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />}
          {i % 4 === 3 && <div className="w-5 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />}
        </div>
      ))}

      {/* Larger Floating Orbs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="floating-element absolute animate-pulse"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationName: "float-slow",
            animationDuration: `${8 + Math.random() * 4}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          <div
            className="rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20"
            style={{
              width: `${40 + Math.random() * 60}px`,
              height: `${40 + Math.random() * 60}px`,
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes float-random {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-15px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
