import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neural Thoughts - Transform Your Raw Thoughts with AI",
  description:
    "Turn your scattered ideas into beautiful, refined expressions with AI-powered tone selection, multi-language translation, and stunning video creation.",
  keywords: "AI, thoughts, refinement, expression, writing, creativity, neural, artificial intelligence",
  authors: [{ name: "Neural Thoughts Team" }],
  openGraph: {
    title: "Neural Thoughts - Transform Your Raw Thoughts with AI",
    description:
      "Turn your scattered ideas into beautiful, refined expressions with AI-powered tone selection, multi-language translation, and stunning video creation.",
    type: "website",
    url: "https://neural-thoughts.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Thoughts - Transform Your Raw Thoughts with AI",
    description:
      "Turn your scattered ideas into beautiful, refined expressions with AI-powered tone selection, multi-language translation, and stunning video creation.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
