"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useTransform, useScroll, useVelocity, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export function TracingBeam({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50])

  const pathLength = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.3, 0.7, 1])
  const yVelocity = useVelocity(y1)
  const smoothVelocity = useSpring(yVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-0.5, 0, 0.5])

  const x1 = useTransform(velocityFactor, [-0.5, 0, 0.5], [0, 50, 100])
  const x2 = useTransform(velocityFactor, [-0.5, 0, 0.5], [100, 50, 0])

  return (
    <motion.div ref={ref} className={cn("relative", className)}>
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(139, 92, 246, 0.3) 0px 0px 20px 2px",
          }}
          className="h-4 w-4 rounded-full border border-violet-500 bg-white"
        />
        <svg
          viewBox={`0 0 100 ${svgHeight}`}
          className="h-full w-20 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
            style={{
              pathLength,
              strokeWidth: 2,
            }}
            className="stroke-violet-500"
          />
        </svg>
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow: scrollYProgress.get() > 0.98 ? "rgba(139, 92, 246, 0.3) 0px 0px 20px 2px" : "none",
          }}
          className="h-4 w-4 translate-y-[-8px] rounded-full border border-violet-500 bg-white"
        />
      </div>
      <div ref={contentRef} className="ml-4 md:ml-16">
        {children}
      </div>
    </motion.div>
  )
}
