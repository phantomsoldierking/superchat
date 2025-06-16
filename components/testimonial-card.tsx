"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

export function TestimonialCard({ name, role, content, avatar, rating }: TestimonialCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 group">
      <div className="p-6">
        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-gray-300 mb-6 italic group-hover:text-white transition-colors">"{content}"</p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={avatar || "/placeholder.svg"}
            alt={name}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </div>
    </Card>
  )
}
