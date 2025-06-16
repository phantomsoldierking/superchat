"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mic,
  Sparkles,
  Globe,
  Upload,
  Video,
  MessageCircle,
  Zap,
  Flame,
  Leaf,
  CloudRain,
  AlertCircle,
} from "lucide-react"
import { FloatingNeuralOrb } from "@/components/floating-neural-orb"
import { ToneSelector } from "@/components/tone-selector"
import { AIOutput } from "@/components/ai-output"
import { FloatingChat } from "@/components/floating-chat"
import { VideoUpload } from "@/components/video-upload"
import { TranslationPanel } from "@/components/translation-panel"
import { cn } from "@/lib/utils"

const tones = [
  { id: "poetic", label: "Poetic", emoji: "✨", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { id: "honest", label: "Honest", emoji: "💬", icon: MessageCircle, color: "from-blue-500 to-cyan-500" },
  { id: "bold", label: "Bold", emoji: "🔥", icon: Flame, color: "from-red-500 to-orange-500" },
  { id: "calm", label: "Calm", emoji: "🧘", icon: Leaf, color: "from-green-500 to-emerald-500" },
  { id: "sad", label: "Sad", emoji: "😢", icon: CloudRain, color: "from-gray-500 to-slate-500" },
  { id: "explain", label: "explain", emoji: "📕", icon: CloudRain, color: "from-gray-500 to-slate-500" },
]

export default function AppPage() {
  const [thought, setThought] = useState("")
  const [selectedTone, setSelectedTone] = useState("poetic")
  const [aiOutput, setAiOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showVideoUpload, setShowVideoUpload] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [error, setError] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setThought(transcript)
      }
      recognition.onerror = () => {
        setIsListening(false)
        setError("Voice recognition failed. Please try typing instead.")
      }

      recognition.start()
    } else {
      setError("Voice recognition is not supported in your browser.")
    }
  }

  const generateThought = async () => {
    if (!thought.trim()) {
      setError("Please enter a thought to refine.")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate-thought", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thought: thought.trim(),
          tone: selectedTone,
        }),
      })

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (data.refinedThought) {
        setAiOutput(data.refinedThought)
        setError("")
      } else {
        setError(data.error || "Failed to generate thought")
      }
    } catch (error: any) {
      console.error("Error generating thought:", error)
      setError("Unable to connect to AI service. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiOutput)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareThought = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Refined Thought",
          text: aiOutput,
        })
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard()
        setError("Copied to clipboard!")
        setTimeout(() => setError(""), 2000)
      }
    } catch (error) {
      console.error("Failed to share:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
      </div>

      {/* Floating Neural Orb */}
      <FloatingNeuralOrb />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Neural Thoughts
          </h1>
          <p className="text-xl text-gray-400 mb-2">Transform your raw thoughts into refined expressions</p>
          <Badge variant="outline" className="border-purple-500/30 text-purple-300">
            Connected to your thoughts...
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <div className="p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </Card>
        )}

        {/* Main Input Section */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold">What's flowing through your mind?</h2>
            </div>

            <div className="relative mb-6">
              <Textarea
                ref={textareaRef}
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Type or speak your raw thought here..."
                className="min-h-[120px] bg-black/50 border-gray-700 text-white placeholder:text-gray-500 resize-none text-lg"
              />
              <Button
                onClick={handleVoiceInput}
                variant="ghost"
                size="sm"
                className={cn("absolute bottom-3 right-3 h-8 w-8 p-0", isListening && "text-red-500 animate-pulse")}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>

            {/* Tone Selector */}
            <ToneSelector tones={tones} selectedTone={selectedTone} onToneChange={setSelectedTone} />

            {/* Generate Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={generateThought}
                disabled={!thought.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Thought
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Output */}
        {aiOutput && (
          <AIOutput
            output={aiOutput}
            onCopy={copyToClipboard}
            onShare={shareThought}
            onTranslate={() => setShowTranslation(true)}
            onRemix={() => {
              // Regenerate with same settings
              generateThought()
            }}
          />
        )}

        {/* Action Buttons */}
        {aiOutput && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Button
              onClick={() => setShowVideoUpload(true)}
              variant="outline"
              className="border-gray-700 hover:border-purple-500 bg-gray-900/50 hover:bg-purple-900/20 text-white h-14"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your Video
            </Button>
            <Button
              onClick={() => {
                /* Generate reel logic */
              }}
              variant="outline"
              className="border-gray-700 hover:border-pink-500 bg-gray-900/50 hover:bg-pink-900/20 text-white h-14"
            >
              <Video className="w-5 h-5 mr-2" />
              Generate Reel with This Thought
            </Button>
          </div>
        )}

        <Separator className="my-12 bg-gray-800" />

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Refinement</h3>
              <p className="text-gray-400 text-sm">Transform raw thoughts into beautiful expressions</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
              <p className="text-gray-400 text-sm">Translate your thoughts into any language</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Video Reels</h3>
              <p className="text-gray-400 text-sm">Create stunning video content with your thoughts</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Modals */}
      {showTranslation && <TranslationPanel text={aiOutput} onClose={() => setShowTranslation(false)} />}

      {showVideoUpload && <VideoUpload onClose={() => setShowVideoUpload(false)} thoughtText={aiOutput} />}

      {showChat && <FloatingChat onClose={() => setShowChat(false)} currentThought={aiOutput} />}
    </div>
  )
}