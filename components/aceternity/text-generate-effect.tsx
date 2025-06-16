"use client"

import { useEffect, useState } from "react"

export function TextGenerateEffect({ words, className }: { words: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(words.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 30) // Adjust speed here

      return () => clearTimeout(timeout)
    } else {
      // Animation complete, stop blinking cursor after a delay
      const timeout = setTimeout(() => {
        setShowCursor(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, words])

  return (
    <div className={className}>
      <p>
        {displayedText}
        {showCursor && <span className="inline-block w-[2px] h-5 bg-white ml-1 animate-blink" />}
      </p>
    </div>
  )
}
