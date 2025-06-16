"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useMotionValueEvent, useScroll, motion } from "framer-motion"

export function StickyScroll({
  content,
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode
  }[]
}) {
  const [activeCard, setActiveCard] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end end"],
  })

  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint)
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index
      }
      return acc
    }, 0)
    setActiveCard(closestBreakpointIndex)
  })

  return (
    <motion.div ref={ref} className="h-full overflow-y-auto flex justify-center relative space-x-10 rounded-md p-4">
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -20,
                }}
                className="text-2xl font-bold text-white mb-4"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -20,
                }}
                className="text-lg text-gray-300 mb-4"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
      <motion.div className="hidden lg:block h-60 lg:h-80 w-80 lg:w-96 bg-black sticky top-10 overflow-hidden rounded-md">
        {content.map((item, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeCard === index ? 1 : 0,
              y: activeCard === index ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
          >
            {item.content}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
