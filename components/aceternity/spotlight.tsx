"use client"

import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"

export function Spotlight({
  className,
  fill = "white",
}: {
  className?: string
  fill?: string
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [size, setSize] = useState(0)

  const updateSpotlightPosition = (event: MouseEvent) => {
    if (!divRef.current) return

    const rect = divRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setPosition({ x, y })
  }

  const updateSpotlightVisibility = (visible: boolean) => {
    setOpacity(visible ? 1 : 0)
    setSize(visible ? 400 : 0)
  }

  useEffect(() => {
    const div = divRef.current
    if (!div) return

    const handleMouseMove = (event: MouseEvent) => {
      updateSpotlightPosition(event)
    }

    const handleMouseEnter = () => {
      updateSpotlightVisibility(true)
    }

    const handleMouseLeave = () => {
      updateSpotlightVisibility(false)
    }

    div.addEventListener("mousemove", handleMouseMove)
    div.addEventListener("mouseenter", handleMouseEnter)
    div.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      div.removeEventListener("mousemove", handleMouseMove)
      div.removeEventListener("mouseenter", handleMouseEnter)
      div.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={divRef} className={cn("absolute inset-0 pointer-events-none", className)}>
      <div
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-purple-500 to-pink-500 mix-blend-soft-light"
        style={{
          opacity: opacity * 0.2,
          transition: "opacity 400ms ease",
        }}
      />
      <div
        className="absolute bg-gradient-to-r from-purple-500 to-pink-500 mix-blend-soft-light rounded-full"
        style={{
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          opacity,
          transition: "opacity 400ms ease, width 400ms ease, height 400ms ease",
        }}
      />
    </div>
  )
}
