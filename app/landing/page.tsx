"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Video, MessageCircle, Zap, Brain, Wand2, Languages, Film, Users } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/animated-counter"
import { FeatureCard } from "@/components/feature-card"
import { HeroScene } from "@/components/hero-scene"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { BackgroundBeams } from "@/components/aceternity/background-beams"
import { SparklesCore } from "@/components/aceternity/sparkles"
import { AnimatedTooltip } from "@/components/aceternity/animated-tooltip"
import { TracingBeam } from "@/components/aceternity/tracing-beam"
import { StickyScroll } from "@/components/aceternity/sticky-scroll"
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards"
import { Spotlight } from "@/components/aceternity/spotlight"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Refinement",
    description: "Transform your raw thoughts into beautiful, expressive statements using advanced AI",
    color: "from-purple-500 to-pink-500",
    delay: 0,
  },
  {
    icon: Wand2,
    title: "Multiple Tones",
    description: "Choose from Poetic, Bold, Honest, Calm, or Sad tones to match your mood",
    color: "from-blue-500 to-cyan-500",
    delay: 0.2,
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Translate your refined thoughts into 12+ languages instantly",
    color: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
  {
    icon: Film,
    title: "Video Reel Creation",
    description: "Turn your thoughts into stunning video content for social media",
    color: "from-orange-500 to-red-500",
    delay: 0.6,
  },
  {
    icon: MessageCircle,
    title: "AI Twin Chat",
    description: "Real-time conversation with your AI assistant for continuous refinement",
    color: "from-indigo-500 to-purple-500",
    delay: 0.8,
  },
  {
    icon: Users,
    title: "Community Sharing",
    description: "Share your refined thoughts and connect with like-minded individuals",
    color: "from-pink-500 to-rose-500",
    delay: 1.0,
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    content: "Neural Thoughts transformed how I express myself. My social media engagement increased by 300%!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Writer",
    content: "The poetic tone feature helped me break through writer's block. It's like having a creative partner.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Life Coach",
    content: "I use this daily to help my clients articulate their feelings. The results are incredible.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

const stats = [
  { number: 50000, label: "Thoughts Refined", suffix: "+" },
  { number: 12, label: "Languages Supported", suffix: "" },
  { number: 98, label: "User Satisfaction", suffix: "%" },
  { number: 24, label: "Hours Saved Daily", suffix: "k+" },
]

const team = [
  {
    name: "Emma Chen",
    designation: "Founder & CEO",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Rodriguez",
    designation: "CTO",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sophia Kim",
    designation: "Head of AI",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "David Patel",
    designation: "Lead Designer",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const contentItems = [
  {
    title: "Capture Your Raw Thoughts",
    description:
      "Start with your unfiltered ideas. Type or speak your thoughts exactly as they come to you, without worrying about clarity or eloquence.",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center rounded-xl">
        <div className="w-full max-w-sm p-4">
          <div className="h-40 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <p className="text-white/70 text-center p-4 italic">
              "Sometimes I feel like my thoughts are too scattered to make sense..."
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Select Your Desired Tone",
    description:
      "Choose how you want your thought to feel. Whether poetic and metaphorical, bold and confident, or calm and reflective - the tone shapes your expression.",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20 flex items-center justify-center rounded-xl">
        <div className="flex gap-2 flex-wrap justify-center">
          {["Poetic ✨", "Bold 🔥", "Honest 💬", "Calm 🧘", "Sad 😢"].map((tone, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-full ${
                i === 0
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-black/40 backdrop-blur-sm border border-white/10 text-white/70"
              }`}
            >
              {tone}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "AI Transforms Your Expression",
    description:
      "Our advanced AI instantly refines your thought, maintaining its core meaning while elevating its expression to match your chosen tone.",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-green-900/20 to-emerald-900/20 flex items-center justify-center rounded-xl">
        <div className="w-full max-w-sm p-4">
          <div className="h-40 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <p className="text-white text-center p-4 italic font-medium">
              "My thoughts dance like scattered stars, seeking patterns in the vast cosmos of my mind."
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Share Your Refined Thought",
    description:
      "Download, copy, or share your beautifully refined expression directly to social media, or transform it into a stunning video reel.",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-orange-900/20 to-red-900/20 flex items-center justify-center rounded-xl">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Video className="w-5 h-5 text-white/70" />
          </div>
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-white/70" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    ),
  },
]

const testimonialCards = [
  {
    quote: "Neural Thoughts transformed how I express myself online. My engagement increased by 300%!",
    name: "Sarah Chen",
    title: "Content Creator",
  },
  {
    quote: "The poetic tone feature helped me break through writer's block. It's like having a creative partner.",
    name: "Marcus Rodriguez",
    title: "Writer & Poet",
  },
  {
    quote: "I use this daily to help my clients articulate their feelings. The results are incredible.",
    name: "Aisha Patel",
    title: "Life Coach",
  },
  {
    quote: "As someone who struggles with words, this tool has been life-changing for my communication.",
    name: "James Wilson",
    title: "Software Engineer",
  },
  {
    quote: "The multilingual feature helps me connect with my international audience like never before.",
    name: "Mei Lin",
    title: "Global Influencer",
  },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Hero Section */}
      <div className="h-screen relative overflow-hidden">
        <HeroScene />

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <div className="container px-4 mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Badge variant="outline" className="border-purple-500/30 text-purple-300 mb-6 backdrop-blur-sm">
                ✨ Powered by Advanced AI
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                Transform Your
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Raw Thoughts
                </span>
              </h1>

              <div className="max-w-3xl mx-auto mb-8">
                <TextGenerateEffect
                  words="Turn your scattered ideas into beautiful, refined expressions with AI-powered tone selection, multi-language translation, and stunning video creation."
                  className="text-xl md:text-2xl text-gray-300 leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Refining Thoughts
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 hover:border-purple-500 bg-gray-900/50 hover:bg-purple-900/20 text-lg px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Neural Thoughts
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </a>
            </div>

            <Link href="/app">
              <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/10">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Section with Sparkles */}
      <section className="relative py-20 overflow-hidden">
        <SparklesCore
          id="stats-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="absolute inset-0 w-full h-full"
          particleColor="#8B5CF6"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-sm p-4 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Tracing Beam */}
      <section id="features" className="relative z-10 py-20">
        <TracingBeam className="px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to transform your thoughts into compelling expressions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </TracingBeam>
      </section>

      {/* How It Works - Sticky Scroll */}
      <section id="how-it-works" className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Transform your thoughts in four simple steps</p>
        </div>

        <div className="h-[30rem] md:h-[40rem]">
          <StickyScroll content={contentItems} />
        </div>
      </section>

      {/* Team Section
      <section className="py-20 relative">
        <BackgroundBeams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">The brilliant minds behind Neural Thoughts</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto">
            <AnimatedTooltip items={team} />
          </div>
        </div>
      </section> */}

      {/* Testimonials - Infinite Moving Cards */}
      <section id="testimonials" className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            What Users Say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied users who've transformed their communication
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <InfiniteMovingCards items={testimonialCards} direction="right" speed="slow" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 p-12 text-center backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Ready to Transform Your Thoughts?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered the power of AI-refined expression.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold">Neural Thoughts</span>
            </div>

            <div className="flex items-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="text-center text-gray-400 mt-8 pt-8 border-t border-gray-800">
            <p>&copy; 2025 Neural Thoughts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
