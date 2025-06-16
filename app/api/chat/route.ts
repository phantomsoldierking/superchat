import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentThought, history } = body

    if (!message) {
      return NextResponse.json({
        response: "I didn't receive your message. Please try again.",
        success: false,
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: "AI chat is currently unavailable. Please try again later.",
        success: false,
      })
    }

    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Build context from chat history (limit to prevent token overflow)
    const recentHistory = (history || [])
      .slice(-3) // Only last 3 messages
      .map((msg: any) => `${msg.type === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are an AI Twin, a creative writing assistant that helps users refine their thoughts and expressions. 

Current thought: "${currentThought || "None yet"}"

Recent conversation:
${recentHistory}

User says: "${message}"

Respond helpfully and concisely (under 80 words). If they ask you to modify their thought, provide a refined version. Be encouraging and creative.`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    let aiResponse = response.text().trim()

    // Clean up response
    aiResponse = aiResponse.replace(/^["']|["']$/g, "").trim()

    if (!aiResponse || aiResponse.length < 3) {
      aiResponse = "I'm here to help! What would you like me to do with your thought?"
    }

    return NextResponse.json({
      response: aiResponse,
      success: true,
    })
  } catch (error: any) {
    console.error("Error in chat:", error)

    let errorMessage = "I'm having trouble right now. Please try again in a moment."

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Chat service is temporarily unavailable."
    } else if (error.message?.includes("quota")) {
      errorMessage = "I'm a bit busy right now. Please try again shortly."
    }

    return NextResponse.json({
      response: errorMessage,
      success: false,
    })
  }
}
