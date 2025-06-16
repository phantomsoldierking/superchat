"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Share, Globe, Shuffle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIOutputProps {
  output: string
  onCopy: () => void
  onShare: () => void
  onTranslate: () => void
  onRemix: () => void
}

export function AIOutput({ output, onCopy, onShare, onTranslate, onRemix }: AIOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="border-green-500/30 text-green-300 bg-green-900/20">
            ✨ AI Refined
          </Badge>
        </div>

        <div className="relative">
          <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6 italic">
            "{output}"
          </blockquote>

          {/* Decorative Quote Marks */}
          <div className="absolute -top-4 -left-2 text-6xl text-purple-500/20 font-serif">"</div>
          <div className="absolute -bottom-8 -right-2 text-6xl text-purple-500/20 font-serif rotate-180">"</div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={cn(
              "border-gray-600 hover:border-blue-500 bg-gray-800/50 hover:bg-blue-900/20 text-white transition-all duration-300",
              copied && "border-green-500 bg-green-900/20 text-green-300",
            )}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            onClick={onShare}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:border-purple-500 bg-gray-800/50 hover:bg-purple-900/20 text-white"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            onClick={onTranslate}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:border-cyan-500 bg-gray-800/50 hover:bg-cyan-900/20 text-white"
          >
            <Globe className="w-4 h-4 mr-2" />
            Translate
          </Button>

          <Button
            onClick={onRemix}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:border-pink-500 bg-gray-800/50 hover:bg-pink-900/20 text-white"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Remix Tone
          </Button>
        </div>
      </div>
    </Card>
  )
}
