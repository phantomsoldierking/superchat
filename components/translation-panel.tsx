"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Copy, Globe, ArrowRight } from "lucide-react"

interface TranslationPanelProps {
  text: string
  onClose: () => void
}

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
]

export function TranslationPanel({ text, onClose }: TranslationPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    if (!selectedLanguage) return

    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage: selectedLanguage,
        }),
      })

      const data = await response.json()
      setTranslatedText(data.translatedText)
    } catch (error) {
      console.error("Error translating text:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const copyTranslation = () => {
    navigator.clipboard.writeText(translatedText)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Translate Your Thought</h3>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Original Text */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                🇺🇸 English
              </Badge>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-white italic">"{text}"</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Select target language:</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Choose a language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translate Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleTranslate}
              disabled={!selectedLanguage || isTranslating}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {isTranslating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Translating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Translate
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Translated Text */}
          {translatedText && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  {languages.find((l) => l.code === selectedLanguage)?.flag}{" "}
                  {languages.find((l) => l.code === selectedLanguage)?.name}
                </Badge>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                <p className="text-white italic text-lg">"{translatedText}"</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={copyTranslation}
                  variant="outline"
                  className="border-gray-600 hover:border-green-500 bg-gray-800 hover:bg-green-900/20 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Translation
                </Button>

                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Translated Thought",
                        text: translatedText,
                      })
                    }
                  }}
                  variant="outline"
                  className="border-gray-600 hover:border-purple-500 bg-gray-800 hover:bg-purple-900/20 text-white"
                >
                  Share Translation
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
