"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function AnimatedTooltip({
  items,
}: {
  items: {
    name: string
    designation: string
    image: string
  }[]
}) {
  return (
    <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
      {items.map((item, idx) => (
        <TooltipItem key={idx} {...item} />
      ))}
    </div>
  )
}

function TooltipItem({
  name,
  designation,
  image,
}: {
  name: string
  designation: string
  image: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-all duration-300">
          <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        </div>
      </motion.div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-white font-medium">{name}</p>
            <p className="text-purple-300 text-sm">{designation}</p>
          </div>
          <div className="w-4 h-4 bg-black/80 rotate-45 -mt-2 z-[-1]" />
        </motion.div>
      )}
    </div>
  )
}
