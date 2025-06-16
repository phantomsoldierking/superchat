"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  delay: number
}

export function FeatureCard({ icon: Icon, title, description, color, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <Card
      ref={cardRef}
      className={`bg-gray-900/50 border-gray-800 hover:border-gray-600 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="p-6">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">{title}</h3>

        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>

        {/* Hover Effect Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`}
        />
      </div>
    </Card>
  )
}
