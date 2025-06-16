"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function BackgroundBeams({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const beamsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (beamsRef.current) {
        const rect = beamsRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={beamsRef}
      className={cn(
        "h-full w-full overflow-hidden [--beam-color:theme(colors.purple.500/50%)] [--beam-size:200px] [--beam-strength:0.3]",
        className,
      )}
      style={{
        background: `
          radial-gradient(
            var(--beam-size) var(--beam-size) at ${mousePosition.x}px ${mousePosition.y}px,
            var(--beam-color) 0%,
            transparent 100%
          )
        `,
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
