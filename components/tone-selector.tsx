"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Tone {
  id: string
  label: string
  emoji: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface ToneSelectorProps {
  tones: Tone[]
  selectedTone: string
  onToneChange: (tone: string) => void
}

export function ToneSelector({ tones, selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Choose your tone:</h3>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => {
          const Icon = tone.icon
          return (
            <Button
              key={tone.id}
              onClick={() => onToneChange(tone.id)}
              variant="outline"
              className={cn(
                "relative overflow-hidden border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 text-white transition-all duration-300",
                selectedTone === tone.id && [
                  "border-transparent",
                  `bg-gradient-to-r ${tone.color}`,
                  "text-white shadow-lg transform scale-105",
                ],
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{tone.label}</span>
                <span className="text-lg">{tone.emoji}</span>
              </div>

              {selectedTone === tone.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
