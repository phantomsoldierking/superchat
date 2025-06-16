"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Video, Download } from "lucide-react"

interface VideoUploadProps {
  onClose: () => void
  thoughtText: string
}

export function VideoUpload({ onClose, thoughtText }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("video", selectedFile)
      formData.append("text", thoughtText)

      const response = await fetch("/api/process-video", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setProcessedVideoUrl(data.videoUrl)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error processing video:", error)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-900 border-gray-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Create Video Reel</h3>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Thought Preview */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Your refined thought:</p>
            <p className="text-white italic">"{thoughtText}"</p>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-white mb-2">{selectedFile ? selectedFile.name : "Upload your video (MP4, 10-15s)"}</p>
              <p className="text-sm text-gray-400">Click to browse or drag and drop</p>
            </div>

            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />

            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Video className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{selectedFile.name}</p>
                    <p className="text-gray-400 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Processing video...</span>
                      <span className="text-white">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {!processedVideoUrl && !isProcessing && (
                  <Button
                    onClick={handleUpload}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Generate Reel
                  </Button>
                )}

                {processedVideoUrl && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-300 text-sm">✅ Video processed successfully!</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(processedVideoUrl, "_blank")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => {
                          const a = document.createElement("a")
                          a.href = processedVideoUrl
                          a.download = "thought-reel.mp4"
                          a.click()
                        }}
                        variant="outline"
                        className="border-gray-600 hover:border-green-500 bg-gray-800 hover:bg-green-900/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
