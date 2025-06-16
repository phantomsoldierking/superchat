"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string
    name: string
    title: string
  }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    const init = () => {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children)
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true)
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem)
          }
        })
        setStart(true)
      }
    }
    init()
  }, [])

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return "30s"
      case "normal":
        return "40s"
      case "slow":
        return "80s"
      default:
        return "40s"
    }
  }

  return (
    <div ref={containerRef} className={cn("scroller relative z-20 max-w-7xl overflow-hidden", className)}>
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
          direction === "right" ? "flex-row-reverse" : "flex-row",
        )}
        style={{
          animationDuration: getSpeed(),
        }}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-6 md:w-[450px]"
          >
            <blockquote>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">{item.quote}</span>
                  <span className="text-sm text-white font-medium">{item.name}</span>
                  <span className="text-xs text-purple-300">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  )
}
